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
import CosImage from "./CosImage";
import { type } from "@testing-library/user-event/dist/type";
import { text } from "stream/consumers";
import { Participant, PostMatchAction } from "../api/matching-event";

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
  const navigate = useNavigate();
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
    onSuccess: () => {
      queryClient.setQueryData<Participant | undefined>(
        ["getParticipantByUserAndEvent", eventId, userId],
        (prev) => {
          if (!prev) return;
          return {
            ...prev,
            postMatchAction: "insist",
          };
        }
      );
    },
  });

  if (matchingsQuery.isLoading) return <>加载中</>;

  if (participantQuery.data?.postMatchAction === "done") {
    return (
      <Box>
        <Typography variant="body1">对方已经收到你的坚持选择</Typography>
        <Typography variant="body1">请等待最终结果</Typography>
      </Box>
    );
  }

  if (matchingsQuery.data?.matched.length === 0)
    return (
      <>
        <Typography variant="body1">
          没有配对成功，但不要灰心，你还可以尝试以下其中一项：
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
    );

  return (
    <>
      {matchingsQuery.data?.matched.length && (
        <div>
          <Typography>恭喜，配对成功</Typography>
          {matchingsQuery.data?.matched.map((user) => {
            return (
              <div key={user.id}>
                <Typography>{user.name}</Typography>
                <Typography>{user.jobTitle}</Typography>
                <CosImage
                  cosLocation={user.photoUrl}
                  style={{ width: "200px" }}
                />
              </div>
            );
          })}
        </div>
      )}
      {matchingsQuery.data?.insisted.length && (
        <div>
          <Typography>哇，好受欢迎，有人坚持选择你</Typography>
          {matchingsQuery.data?.insisted.map((user) => {
            return (
              <div key={user.id}>
                <Typography>{user.name}</Typography>
                <Typography>{user.jobTitle}</Typography>
                <CosImage
                  cosLocation={user.photoUrl}
                  style={{ width: "200px" }}
                />
              </div>
            );
          })}
        </div>
      )}
      {/* <Typography>
        互选已结束，反选和坚持仍在进行中，你仍有可能获得更多配对
      </Typography>*/}
    </>
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
  const text = action === "insist" ? "坚持" : "反选";
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
