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
import Paths from "../paths";
import {
  AppBar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import UserProfileForChoosing from "./UserProfileForChoosing";
import { User } from "../api/user";
import { MatchingEvent, Picking } from "../api/matching-event";

type ChosenNumberType = "EQUAL" | "LESS" | "OVER" | null;

type Props = {
  matchingEventQuery: UseQueryResult<matchingEventApi.MatchingEvent, unknown>;
};

const PhaseChoosing = ({ matchingEventQuery }: Props) => {
  const { userId = "", eventId = "" } = useParams();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const [dialogType, setDialogType] = useState<ChosenNumberType>(null);

  const getPickingQuery = useQuery(
    ["getPickingsByUserAndEvent", userId, eventId],
    () =>
      matchingEventApi.getPickingsByUserAndEvent({
        madeByUserId: userId,
        matchingEventId: eventId,
      })
  );
  const confirmPickingsMutation = useMutation(
    () =>
      matchingEventApi.confirmPickingByUser({
        userId,
        matchingEventId: eventId,
      }),
    {
      onSuccess: () => {
        setDialogType(null);
        queryClient.setQueryData<MatchingEvent | undefined>(
          ["getMatchingEventForUser", eventId, userId],
          () => {
            console.log("matchingEventQuery.data", matchingEventQuery?.data);
            console.log("key", ["getMatchingEventById", eventId, userId]);
            if (!matchingEventQuery.data) return;
            return {
              ...matchingEventQuery.data,
              phase: "matching",
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
        {matchingEventQuery.data?.participants.map((user) => (
          <UserProfileForChoosing
            key={user.id}
            user={user}
            isPicked={Boolean(pickingMap[user.id])}
            onTogglePick={() => {
              queryClient.setQueryData<Picking[] | undefined>(
                ["getPickingsByUserAndEvent", userId, eventId],
                () => {
                  if (!getPickingQuery.data) return;

                  if (pickingMap[user.id]) {
                    return getPickingQuery.data.filter(
                      (picking) => picking.pickedUserId !== user.id
                    );
                  } else {
                    return [
                      ...getPickingQuery.data,
                      {
                        madeByUserId: userId,
                        matchingEventId: eventId,
                        pickedUserId: user.id,
                      },
                    ];
                  }
                }
              );
            }}
          />
        ))}
      </Box>
      {getPickingQuery.data && Boolean(getPickingQuery.data.length) && (
        <AppBar position="fixed" sx={{ top: "auto", bottom: 0 }}>
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
    <Dialog
      open={Boolean(type)}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
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
          <Button onClick={handleClose} autoFocus>
            返回
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default PhaseChoosing;
