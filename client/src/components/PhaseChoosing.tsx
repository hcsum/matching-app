import React, { useCallback, useState } from "react";
import _ from "lodash";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { matchingEventApi, userApi } from "../api";
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
import { User } from "../api/user";
import { Participant, Picking } from "../api/matching-event";
import { useAuthState } from "./AuthProvider";

type ChosenNumberType = "EQUAL" | "LESS" | "OVER" | null;

type Props = {
  matchingEventQuery: UseQueryResult<matchingEventApi.MatchingEvent, unknown>;
};

const PhaseChoosing = ({ matchingEventQuery }: Props) => {
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
  const confirmPickingsMutation = useMutation(
    () =>
      matchingEventApi.confirmPickingByUser({
        userId: user!.id,
        matchingEventId: eventId,
      }),
    {
      onSuccess: () => {
        setDialogType(null);
        queryClient.setQueryData<Participant | undefined>(
          ["getParticipantByUserAndEvent", eventId, user!.id],
          (prev) => {
            if (!prev) return;
            return {
              ...prev,
              hasConfirmedPicking: true,
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
    return _.keyBy(matchingEventQuery.data?.participants, "id");
  }, [matchingEventQuery.data?.participants]);

  const pickingMap = React.useMemo(() => {
    return _.keyBy(getPickingQuery.data, "pickedUserId");
  }, [getPickingQuery.data]);

  const handleTogglePick = useCallback(
    (participant: User) => {
      queryClient.setQueryData<Picking[] | undefined>(
        ["getPickingsByUserAndEvent", user!.id, eventId],
        () => {
          if (!getPickingQuery.data) return;
          if (pickingMap[participant.id]) {
            return getPickingQuery.data.filter(
              (picking) => picking.pickedUserId !== participant.id
            );
          } else {
            return [
              ...getPickingQuery.data,
              {
                madeByUserId: user!.id,
                matchingEventId: eventId,
                pickedUserId: participant.id,
              },
            ];
          }
        }
      );
    },
    [eventId, getPickingQuery.data, pickingMap, queryClient, user]
  );

  if (matchingEventQuery.isLoading || getPickingQuery.isLoading)
    return <>加载中</>;

  return (
    <>
      <SubmitDialog
        type={dialogType}
        handleClose={() => setDialogType(null)}
        handleConfirm={confirmPickingsMutation.mutateAsync}
      />
      <Typography variant="h5">互选中</Typography>
      <Box sx={{ paddingBottom: "100px" }}>
        {matchingEventQuery.data?.participants.map((participant) => (
          <UserProfileForChoosing
            key={participant.id}
            user={participant}
            isPicked={Boolean(pickingMap[participant.id])}
            onTogglePick={() => handleTogglePick(participant)}
          />
        ))}
      </Box>
      {getPickingQuery.data && Boolean(getPickingQuery.data.length) && (
        <AppBar position="fixed" sx={{ top: 0, bottom: "auto" }}>
          <Toolbar
            sx={{
              flexWrap: "wrap",
              paddingBottom: "8px",
            }}
          >
            {getPickingQuery.data?.map((picked) => (
              <Chip
                sx={{
                  backgroundColor: theme.palette.action.selected,
                  color: theme.palette.common.white,
                  marginRight: "10px",
                  marginTop: "10px",
                }}
                key={picked.pickedUserId}
                label={participantMap[picked.pickedUserId].name}
              />
            ))}
            <Button
              variant="outlined"
              color="info"
              sx={{ marginTop: "10px" }}
              onClick={onSubmit}
            >
              提交
            </Button>
          </Toolbar>
        </AppBar>
      )}
    </>
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
      text = "已经超过最大可选择数了哦";
      break;
    case "EQUAL":
      text = "确定提交吗?";
      break;
    default:
  }

  return (
    <Dialog open={Boolean(type)} onClose={handleClose}>
      {/* <DialogTitle id="alert-dialog-title">{text}</DialogTitle> */}
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
