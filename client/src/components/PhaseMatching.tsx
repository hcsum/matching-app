import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { matchingEventApi } from "../api";
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
  GetParticipantResponse,
  PostMatchingAction,
} from "../api/matching-event";
import PhaseMatchingInsist from "./PhaseMatchingInsist";
import PhaseMatchingReverse from "./PhaseMatchingReverse";
import UserSmallProfile from "./UserSmallProfile";
import { useSnackbarState } from "./GlobalContext";
import { useAuthState } from "./AuthProvider";

const ActionTile = styled(Paper)(({ theme }) => ({
  cursor: "pointer",
  height: "300px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  textAlign: "center",
  marginBottom: theme.spacing(6),
}));

type Props = {
  matchingEvent: matchingEventApi.MatchingEvent;
  participant: matchingEventApi.Participant;
};

const PhaseMatching = ({ matchingEvent, participant }: Props) => {
  const { eventId = "" } = useParams();
  const { user } = useAuthState();
  const queryClient = useQueryClient();
  const [postMatchingAction, setPostMatchAction] =
    useState<PostMatchingAction>();
  const [currentInsistedUserId, setCurrentInsistedUserId] = useState<
    string | undefined
  >(undefined);
  const { setSnackBarContent } = useSnackbarState();
  const theme = useTheme();
  const matchingsQuery = useQuery(
    ["getMatchingsByUserAndEvent", user!.id, eventId],
    async () =>
      await matchingEventApi.getMatchingsByUserAndEvent({
        userId: user!.id,
        eventId,
      }),
    {
      enabled: matchingEvent.phase === "MATCHING",
    }
  );
  const mutatePostMatchAction = useMutation({
    mutationFn: (action: PostMatchingAction) =>
      matchingEventApi.setParticipantPostMatchAction({
        userId: user!.id,
        eventId,
        action,
      }),
    onSuccess: (resp) => {
      if (resp === "can not chooose reverse") {
        setPostMatchAction(undefined);
        setSnackBarContent("请选择坚持吧。");
        return;
      }
      queryClient.setQueryData<GetParticipantResponse>(
        ["getParticipantByUserAndEvent", eventId, user!.id],
        (prev) => {
          return {
            ...prev!,
            participant: {
              ...prev!.participant,
              postMatchingAction,
            },
          };
        }
      );
    },
  });
  const mutateResponseInsist = useMutation({
    mutationFn: (insistedUserId: string) =>
      matchingEventApi.responseInsistPickingByUser({
        userId: user!.id,
        eventId,
        insistedUserId,
      }),
    onSuccess: () => {
      // queryClient.setQueryData<MatchingResponse | undefined>(
      //   ["getMatchingsByUserAndEvent", user!.id, eventId],
      //   (prev) => {
      //     if (!prev) return;
      //     const insistedUser = prev.insisted.find(
      //       (user) => user.id === currentInsistedUserId
      //     );
      //     insistedUser && (insistedUser.isInsistResponded = true);
      //     return prev;
      //   }
      // );
      matchingsQuery.refetch();
      setCurrentInsistedUserId(undefined);
    },
  });

  if (matchingsQuery.isLoading) return <>加载中</>;

  // no matchings and made a insist request
  if (matchingsQuery.data?.waitingForInsistResponse.length)
    return (
      <Box>
        <Typography variant="body1" mb={4}>
          对方已经收到你的坚持请求, 如对方回应，将转换为成功配对
        </Typography>
        {matchingsQuery.data?.waitingForInsistResponse.map((user) => {
          return (
            <UserSmallProfile user={user} key={user.id}>
              <Typography variant="body1">等待对方回应</Typography>
            </UserSmallProfile>
          );
        })}
      </Box>
    );

  // no matchings and haven't choose insist or reverse
  if (
    matchingsQuery.data?.matched.length === 0 &&
    !participant.postMatchingAction
  ) {
    return (
      <>
        <Typography variant="body1">
          没有配对成功，但不要灰心，你还可以尝试：
        </Typography>
        <Box sx={{ marginTop: "1em" }}>
          <ActionTile
            onClick={() => setPostMatchAction("INSIST")}
            style={{
              backgroundColor: "#7303fc",
              color: theme.palette.common.white,
            }}
          >
            <Typography variant="h2">坚持</Typography>
            <Typography variant="body1">
              从你选择的人中挑选一位，对方将收到你的配对邀请
            </Typography>
          </ActionTile>
          <ActionTile
            onClick={() => setPostMatchAction("REVERSE")}
            style={{
              backgroundColor: "#f7119b",
              color: theme.palette.common.white,
            }}
          >
            <Typography variant="h2">反选</Typography>
            <Typography variant="body1">
              你将能够看到选择了你的人，选择一位与其配对
            </Typography>
          </ActionTile>
        </Box>
        <ConfirmPostMatchActionDialog
          action={postMatchingAction}
          onCancel={() => setPostMatchAction(undefined)}
          onConfirm={() =>
            postMatchingAction &&
            mutatePostMatchAction.mutateAsync(postMatchingAction)
          }
        />
      </>
    );
  }

  // has matchings and/or has insisted
  if (
    matchingsQuery.data?.matched.length !== 0 ||
    matchingsQuery.data?.insisted.length !== 0
  )
    return (
      <Box>
        {matchingsQuery.data?.matched.length ? (
          <Box>
            <Typography variant="h1">
              恭喜🎉，获得了{matchingsQuery.data.matched.length}个成功配对
            </Typography>
            {matchingsQuery.data?.matched.map((user) => {
              return <UserSmallProfile user={user} key={user.id} />;
            })}
          </Box>
        ) : null}
        {matchingsQuery.data?.insisted.length ? (
          <div>
            <Typography variant="h1">哇😱，好受欢迎，有人坚持选择你</Typography>
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
                  <UserSmallProfile user={user}>
                    <Button
                      variant="contained"
                      onClick={() => setCurrentInsistedUserId(user.id)}
                    >
                      回应
                    </Button>
                  </UserSmallProfile>
                </div>
              );
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
    );

  // chose but has not performed postMatchingAction,
  // if performed reverse, matched will not be empty
  // if performed insist, waitingForInsistResponse will not be empty
  if (
    participant.postMatchingAction &&
    !matchingsQuery.data?.waitingForInsistResponse.length
  ) {
    if (participant.postMatchingAction === "INSIST")
      return <PhaseMatchingInsist />;
    if (participant.postMatchingAction === "REVERSE")
      return <PhaseMatchingReverse />;
  }

  // no matchings, no insisted, and has done postMatchingAction
  if (participant.postMatchingAction) {
    return (
      <Box>
        <Typography variant="body1">本次活动所有匹配已经完成</Typography>
        <Typography variant="body1">不用灰心，缘分未到，下次再见</Typography>
      </Box>
    );
  }

  return <div>啥也不是</div>;
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
  action: PostMatchingAction;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  let text;
  if (action === "INSIST") text = "坚持";
  if (action === "REVERSE") text = "反选";
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
