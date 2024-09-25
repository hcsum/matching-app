import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { routes } from "../routes";
import FullScreenLoader from "./FullScreenLoader";

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
  postMatchingAction: PostMatchingAction;
  hasPerformedPostMatchingAction: boolean;
};

const PhaseMatching = ({
  postMatchingAction,
  hasPerformedPostMatchingAction,
}: Props) => {
  const { eventId = "" } = useParams();
  const { user } = useAuthState();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [chosenAction, setChosenAction] = useState<PostMatchingAction>();
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
      refetchOnWindowFocus: false,
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
        setChosenAction(undefined);
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
              postMatchingAction: chosenAction,
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
      setCurrentInsistedUserId(undefined);
      matchingsQuery.refetch();
    },
  });

  const handlePostMatchActionPerformed = async () => {
    queryClient.setQueryData<GetParticipantResponse>(
      ["getParticipantByUserAndEvent", eventId, user!.id],
      (prev) => {
        return {
          ...prev!,
          participant: {
            ...prev!.participant,
            hasPerformedPostMatchingAction: true,
          },
        };
      }
    );
    matchingsQuery.refetch();
  };

  if (matchingsQuery.isLoading) return <FullScreenLoader loading />;

  const hasMatchings = !!matchingsQuery.data?.matched.length;

  if (!hasMatchings && !postMatchingAction) {
    return (
      <>
        <Typography variant="body1">
          没有配对成功，但不要灰心，你还可以尝试：
        </Typography>
        <Box sx={{ marginTop: "1em" }}>
          <ActionTile
            onClick={() => setChosenAction("INSIST")}
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
            onClick={() => setChosenAction("REVERSE")}
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
          action={chosenAction}
          onCancel={() => setChosenAction(undefined)}
          onConfirm={() =>
            chosenAction && mutatePostMatchAction.mutateAsync(chosenAction)
          }
        />
      </>
    );
  }

  // chose postMatchingAction but has not performed it,
  if (postMatchingAction && !hasPerformedPostMatchingAction) {
    if (postMatchingAction === "INSIST")
      return <PhaseMatchingInsist onSuccess={handlePostMatchActionPerformed} />;
    if (postMatchingAction === "REVERSE")
      return (
        <PhaseMatchingReverse onSuccess={handlePostMatchActionPerformed} />
      );
  }

  return (
    <>
      {hasMatchings && (
        <Box>
          <Typography variant="h1">
            恭喜🎉，获得了{matchingsQuery.data!.matched.length}个成功配对
          </Typography>
          {matchingsQuery.data?.matched.map((user) => {
            return <UserSmallProfile user={user} key={user.id} />;
          })}
        </Box>
      )}
      {/* someone insisted to pick you */}
      {!!matchingsQuery.data?.insisted.length && (
        <Box>
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
          <ConfirmInsistResponseDialog
            open={Boolean(currentInsistedUserId)}
            onCancel={() => setCurrentInsistedUserId(undefined)}
            onConfirm={() =>
              mutateResponseInsist.mutateAsync(currentInsistedUserId || "")
            }
          />
        </Box>
      )}
      {/* performed insist action */}
      {!!matchingsQuery.data?.waitingForInsistResponse.length && (
        <Box>
          <Typography variant="h1">
            🫣对方已经收到你的坚持请求, 如对方回应，将转换为成功配对：
          </Typography>
          {matchingsQuery.data?.waitingForInsistResponse.map((user) => {
            return <UserSmallProfile user={user} key={user.id} />;
          })}
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
