import React, { useCallback, useMemo, useState } from "react";
import _ from "lodash";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { matchingEventApi, userApi } from "../api";
import Paths from "../paths";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Paper,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import {
  MatchingResponse,
  Participant,
  PostMatchAction,
} from "../api/matching-event";
import PhaseMatchingInsist from "./PhaseMatchingInsist";
import PhaseMatchingReverse from "./PhaseMatchingReverse";
import UserSmallProfile from "./UserSmallProfile";
import { useSnackbarState } from "./GlobalContext";

const ActionTile = styled(Paper)(({ theme }) => ({
  height: "300px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  marginBottom: theme.spacing(6),
}));

type Props = {
  matchingEventQuery: UseQueryResult<matchingEventApi.MatchingEvent, unknown>;
  participantQuery: UseQueryResult<matchingEventApi.Participant, unknown>;
};

const PhaseMatching = ({ matchingEventQuery, participantQuery }: Props) => {
  const { userId = "", eventId = "" } = useParams();
  const queryClient = useQueryClient();
  const [postMatchAction, setPostMatchAction] = useState<PostMatchAction>();
  const [currentInsistedUserId, setCurrentInsistedUserId] = useState<
    string | undefined
  >(undefined);
  const navigate = useNavigate();
  const { setSnackBarContent } = useSnackbarState();
  const theme = useTheme();
  const matchingsQuery = useQuery(
    ["getMatchingsByUserAndEvent", userId, eventId],
    async () =>
      await matchingEventApi.getMatchingsByUserAndEvent({
        userId,
        eventId,
      }),
    {
      enabled: matchingEventQuery.data?.phase === "matching",
    }
  );
  const mutatePostMatchAction = useMutation({
    mutationFn: (action: PostMatchAction) =>
      matchingEventApi.setParticipantPostMatchAction({
        userId,
        eventId,
        action,
      }),
    onSuccess: (resp) => {
      if (resp === "can not chooose reverse") {
        setPostMatchAction(undefined);
        setSnackBarContent("请选择坚持吧。");
        return;
      }
      queryClient.setQueryData<Participant | undefined>(
        ["getParticipantByUserAndEvent", eventId, userId],
        (prev) => {
          if (!prev) return;
          return {
            ...prev,
            postMatchAction,
          };
        }
      );
    },
  });
  const mutateResponseInsist = useMutation({
    mutationFn: (insistedUserId: string) =>
      matchingEventApi.responseInsistPickingByUser({
        userId,
        eventId,
        insistedUserId,
      }),
    onSuccess: () => {
      console.log("success");
      queryClient.setQueryData<MatchingResponse | undefined>(
        ["getMatchingsByUserAndEvent", userId, eventId],
        (prev) => {
          if (!prev) return;
          const insistedUser = prev.insisted.find(
            (user) => user.id === currentInsistedUserId
          );
          insistedUser && (insistedUser.isInsistResponded = true);
          console.log("insistedUser", insistedUser);
          return prev;
        }
      );
      setCurrentInsistedUserId(undefined);
    },
  });

  const stillNoMatchAfterPostMatchActionDone =
    participantQuery.data?.postMatchAction === "done" &&
    matchingsQuery.data?.matched.length === 0 &&
    matchingsQuery.data?.reverse.length === 0 &&
    matchingsQuery.data?.insisted.length === 0;

  if (matchingsQuery.isLoading) return <>加载中</>;

  // if (participantQuery.data?.postMatchAction) {
  //   if (participantQuery.data?.postMatchAction === "insist")
  //     return <PhaseMatchingInsist />;
  //   if (participantQuery.data?.postMatchAction === "reverse")
  //     return <PhaseMatchingReverse />;
  //   if (participantQuery.data?.postMatchAction === "wait-for-insist-response") {
  //     return (
  //       <Box>
  //         <Typography variant="body1">对方已经收到你的坚持请求</Typography>
  //         <Typography variant="body1">请等待回复</Typography>
  //       </Box>
  //     );
  //   }
  // }

  return (
    <>
      <Box>
        {matchingsQuery.data?.matched.length ? (
          <div>
            <Typography>恭喜，配对成功</Typography>
            {matchingsQuery.data?.matched.map((user) => {
              return <UserSmallProfile user={user} key={user.id} />;
            })}
          </div>
        ) : null}
        {matchingsQuery.data?.insisted.length ? (
          <div>
            <Typography>哇，好受欢迎，有人坚持选择你</Typography>
            {matchingsQuery.data?.insisted.map((user) => {
              return (
                <div
                  key={user.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <UserSmallProfile user={user} />
                  {user.isInsistResponded ? (
                    <Button variant="contained" disabled>
                      已回应
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={() => setCurrentInsistedUserId(user.id)}
                    >
                      回应
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        ) : null}
        {matchingsQuery.data?.reverse.length ? (
          <div>
            <Typography>你获得了反向选择配对</Typography>
            {matchingsQuery.data?.reverse.map((user) => {
              return <UserSmallProfile user={user} key={user.id} />;
            })}
          </div>
        ) : null}
        <ConfirmInsistResponseDialog
          open={Boolean(currentInsistedUserId)}
          onCancel={() => setCurrentInsistedUserId(undefined)}
          onConfirm={() =>
            mutateResponseInsist.mutateAsync(currentInsistedUserId || "")
          }
        />
      </Box>
      {matchingsQuery.data?.matched.length === 0 &&
        matchingsQuery.data?.insisted.length === 0 &&
        matchingsQuery.data?.reverse.length === 0 &&
        !participantQuery.data?.postMatchAction && (
          <>
            <Typography variant="body1">
              没有配对成功，但不要灰心，你还可以尝试：
            </Typography>
            <Box sx={{ marginTop: "1em" }}>
              <ActionTile
                onClick={() => setPostMatchAction("insist")}
                style={{
                  backgroundColor: "#7303fc",
                  color: theme.palette.common.white,
                }}
              >
                <Typography variant="h4">坚持</Typography>
                <Typography variant="body1">
                  从你选择的人中挑选一位，对方将收到你的配对邀请
                </Typography>
              </ActionTile>
              <ActionTile
                onClick={() => setPostMatchAction("reverse")}
                style={{
                  backgroundColor: "#f7119b",
                  color: theme.palette.common.white,
                }}
              >
                <Typography variant="h4">反选</Typography>
                <Typography variant="body1">
                  你将能够看到选择了你的人，选择一位与其配对
                </Typography>
              </ActionTile>
            </Box>
            <ConfirmPostMatchActionDialog
              action={postMatchAction}
              onCancel={() => setPostMatchAction(undefined)}
              onConfirm={() =>
                postMatchAction &&
                mutatePostMatchAction.mutateAsync(postMatchAction)
              }
            />
          </>
        )}
      {participantQuery.data?.postMatchAction ===
        "wait-for-insist-response" && (
        <>
          <Box>
            <Typography variant="body1">对方已经收到你的坚持请求</Typography>
            <Typography variant="body1">请等待回复</Typography>
          </Box>
        </>
      )}
      {stillNoMatchAfterPostMatchActionDone && (
        <Box>
          <Typography variant="body1">本次活动所有匹配已经完成</Typography>
          <Typography variant="body1">
            不用灰心，你的资格将被保留到下次活动
          </Typography>
        </Box>
      )}
    </>
  );
};

const ConfirmInsistResponseDialog = ({
  open,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogContent>
        <DialogContentText>确定回应对方吗？回应后将配对</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="info" onClick={onCancel}>
          取消
        </Button>
        <Button color="info" onClick={onConfirm}>
          确定
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ConfirmPostMatchActionDialog = ({
  action,
  onConfirm,
  onCancel,
}: {
  action: PostMatchAction;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  let text;
  if (action === "insist") text = "坚持";
  if (action === "reverse") text = "反选";
  return (
    <Dialog open={Boolean(action)} onClose={onCancel}>
      <DialogContent>
        <DialogContentText>只能二选一，确定选择{text}吗？</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="info" onClick={onCancel}>
          取消
        </Button>
        <Button color="info" onClick={onConfirm}>
          确定
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PhaseMatching;
