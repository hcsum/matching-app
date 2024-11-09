import React, { useCallback, useState } from "react";
import _ from "lodash";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { matchingEventApi } from "../api";
import {
  AppBar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import UserProfileForChoosing from "./UserProfileForChoosing";
import {
  EventUser,
  GetParticipantResponse,
  Picking,
} from "../api/matching-event";
import { useAuthState } from "./AuthProvider";
import UserSmallProfile from "./UserSmallProfile";

type ChosenNumberType = "EQUAL" | "LESS" | "OVER" | null;

type Props = {
  participants: EventUser[];
  hasConfirmedPicking?: boolean;
  matchingStartsAt: string;
};

const PhaseChoosing = ({
  participants,
  matchingStartsAt,
  hasConfirmedPicking,
}: Props) => {
  const { eventId = "" } = useParams();
  const { user } = useAuthState();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const [dialogType, setDialogType] = useState<ChosenNumberType>(null);

  const getPickingQuery = useQuery(
    ["getPickingsByUserAndEvent", user!.id, eventId],
    () =>
      matchingEventApi.getPickingsByUserAndEvent({
        madeByUserId: user!.id,
        matchingEventId: eventId,
      })
  );
  const pickMutation = useMutation(
    (
      params: Pick<Picking, "madeByUserId" | "matchingEventId" | "pickedUserId">
    ) => matchingEventApi.toggleUserPick(params)
  );
  const confirmPickingsMutation = useMutation(
    () =>
      matchingEventApi.confirmPickingByUser({
        userId: user!.id,
        matchingEventId: eventId,
      }),
    {
      onSuccess: () => {
        setDialogType(null);
        queryClient.setQueryData<GetParticipantResponse>(
          ["getParticipantByUserAndEvent", eventId, user!.id],
          (prev) => {
            return {
              ...prev!,
              participant: {
                ...prev!.participant,
                hasConfirmedPicking: true,
              },
            };
          }
        );
      },
    }
  );

  const onSubmit = useCallback(() => {
    if (!getPickingQuery.data) return;

    if (getPickingQuery.data.length < 3) {
      setDialogType("LESS");
    } else if (getPickingQuery.data.length > 3) {
      setDialogType("OVER");
    } else setDialogType("EQUAL");
  }, [getPickingQuery.data]);

  const participantMap = React.useMemo(() => {
    return _.keyBy(participants, "id");
  }, [participants]);

  const pickingMap = React.useMemo(() => {
    return _.keyBy(getPickingQuery.data, "pickedUserId");
  }, [getPickingQuery.data]);

  const handleTogglePick = useCallback(
    (userId: string, action: "add" | "remove") => {
      if (action === "add" && getPickingQuery.data!.length >= 3) {
        setDialogType("OVER");
        return;
      }

      pickMutation.mutate({
        madeByUserId: user!.id,
        matchingEventId: eventId,
        pickedUserId: userId,
      });

      queryClient.setQueryData<Picking[] | undefined>(
        ["getPickingsByUserAndEvent", user!.id, eventId],
        () => {
          if (!getPickingQuery.data) return;
          if (action === "remove") {
            return getPickingQuery.data.filter(
              (picking) => picking.pickedUserId !== userId
            );
          } else {
            return [
              ...getPickingQuery.data,
              {
                madeByUserId: user!.id,
                matchingEventId: eventId,
                pickedUserId: userId,
              },
            ];
          }
        }
      );
    },
    [eventId, getPickingQuery.data, pickMutation, queryClient, user]
  );

  if (hasConfirmedPicking) {
    return (
      <Box>
        <Typography variant="h2" mb={2}>
          你已经提交选择🤞
        </Typography>
        <Typography variant="body1" mb={2}>
          互选阶段将于{matchingStartsAt}结束，届时你将收到匹配结果
        </Typography>
        {getPickingQuery.data?.map((picked) => {
          const pickedUser = participantMap[picked.pickedUserId];
          return <UserSmallProfile key={pickedUser.id} user={pickedUser} />;
        })}
      </Box>
    );
  }

  return (
    <Box>
      {getPickingQuery.data && Boolean(getPickingQuery.data.length) && (
        <AppBar position="fixed" sx={{ top: 0, bottom: "auto" }}>
          <Toolbar
            sx={{
              flexWrap: "wrap",
              paddingBottom: 1,
            }}
          >
            {getPickingQuery.data?.map((picked) => (
              <Chip
                sx={{
                  marginRight: 2,
                  marginTop: 1,
                  backgroundColor: theme.palette.secondary.main,
                }}
                key={picked.pickedUserId}
                label={participantMap[picked.pickedUserId]?.name}
              />
            ))}
            <Button
              variant="outlined"
              sx={{ marginTop: "10px", color: "white" }}
              onClick={onSubmit}
            >
              提交
            </Button>
          </Toolbar>
        </AppBar>
      )}
      <Typography variant="h1">互选中</Typography>
      <Typography variant="h3" mb={6} mt={4}>
        请于<b>{matchingStartsAt}</b>前提交你的选择, 最多选择3位
      </Typography>
      <Box sx={{ paddingBottom: "100px" }}>
        {participants.map((participant, idx) => (
          <UserProfileForChoosing
            index={idx}
            key={participant.id}
            eventUser={participant}
            isPicked={Boolean(pickingMap[participant.id])}
            onTogglePick={handleTogglePick}
          />
        ))}
        <Typography textAlign={"center"} color="gray" mt={10}>
          已全部显示
        </Typography>
      </Box>
      <SubmitDialog
        type={dialogType}
        handleClose={() => setDialogType(null)}
        handleConfirm={confirmPickingsMutation.mutateAsync}
      />
    </Box>
  );
};

const SubmitDialog = ({
  type,
  handleClose,
  handleConfirm,
}: {
  type: ChosenNumberType;
  handleClose: () => void;
  handleConfirm: () => void;
}) => {
  let text = "";
  switch (type) {
    case "LESS":
      text = "还可以选择更多，确定提交吗?";
      break;
    case "OVER":
      text = "最多选择3位哦";
      break;
    case "EQUAL":
      text = "确定提交吗?";
      break;
    default:
  }

  return (
    <Dialog open={Boolean(type)} onClose={handleClose}>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {text}
        </DialogContentText>
      </DialogContent>
      {(type === "EQUAL" || type === "LESS") && (
        <DialogActions>
          <Button color="info" onClick={handleClose}>
            取消
          </Button>
          <Button color="info" onClick={handleConfirm} autoFocus>
            提交
          </Button>
        </DialogActions>
      )}
      {type === "OVER" && (
        <DialogActions>
          <Button color="info" onClick={handleClose} autoFocus>
            返回
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default PhaseChoosing;
