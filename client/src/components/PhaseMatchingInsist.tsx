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
  IconButton,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import CosImage from "./CosImage";
import {
  Participant,
  PickedUser,
  PostMatchAction,
} from "../api/matching-event";

const PhaseMatchingInsist = () => {
  const { userId = "", eventId = "" } = useParams();
  const [insistedUser, setInsistedUser] = useState<PickedUser | undefined>();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const pickedUsersQuery = useQuery(
    ["getPickedUsersByUserAndEvent", userId, eventId],
    () =>
      matchingEventApi.getPickedUsersByUserAndEvent({
        madeByUserId: userId,
        matchingEventId: eventId,
      })
  );
  const insistChoosingMutation = useMutation({
    mutationFn: () =>
      matchingEventApi.setInsistChoosingByUser({
        userId,
        eventId,
        pickedUserId: insistedUser?.id ?? "",
      }),
    onSuccess: (resp) => {
      queryClient.setQueryData<Participant | undefined>(
        ["getParticipantByUserAndEvent", eventId, userId],
        () => {
          return {
            ...resp,
          };
        }
      );
    },
  });

  const onInsist = useCallback((user: PickedUser) => {
    setInsistedUser(user);
  }, []);

  return (
    <>
      <Typography variant="body1" fontWeight={"700"}>
        坚持: 从以下你选择的人中挑选一位
      </Typography>
      <Typography variant="body1" fontWeight={"700"}>
        对方将收到你的配对邀请
      </Typography>
      <Box
        sx={{
          display: "flex",
          margin: theme.spacing(1),
          marginTop: theme.spacing(3),
        }}
      >
        {pickedUsersQuery.data?.map((user) => {
          return (
            <div key={user.id} style={{ marginRight: "1em" }}>
              <CosImage
                cosLocation={user.photoUrl}
                style={{
                  height: "100px",
                  borderRadius: "10%",
                }}
              />
              <Typography>{user.name}</Typography>
              <Typography>{user.jobTitle}</Typography>
              <Button variant="contained" onClick={() => onInsist(user)}>
                选择
              </Button>
            </div>
          );
        })}
      </Box>
      <ConfirmInsistChoosingDialog
        name={insistedUser?.name}
        onConfirm={insistChoosingMutation.mutateAsync}
        onCancel={() => setInsistedUser(undefined)}
      />
    </>
  );
};

const ConfirmInsistChoosingDialog = ({
  name,
  onConfirm,
  onCancel,
}: {
  name: string | undefined;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  return (
    <Dialog open={Boolean(name)} onClose={onCancel}>
      <DialogContent>
        <DialogContentText>确定坚持选择{name}吗？</DialogContentText>
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

export default PhaseMatchingInsist;
