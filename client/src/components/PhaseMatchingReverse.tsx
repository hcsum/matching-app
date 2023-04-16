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

const PhaseMatchingReverse = () => {
  const { userId = "", eventId = "" } = useParams();
  const [reverseUser, setReverseUser] = useState<PickedUser | undefined>();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const pickedUsersQuery = useQuery(
    ["getPickedUsersByUserAndEvent", userId, eventId],
    () =>
      matchingEventApi.getUsersPickedMeByUserAndEvent({
        pickedUserId: userId,
        matchingEventId: eventId,
      })
  );
  const insistChoosingMutation = useMutation({
    mutationFn: () =>
      matchingEventApi.setInsistChoosingByUser({
        userId,
        eventId,
        pickedUserId: reverseUser?.id ?? "",
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

  const onReversePick = useCallback((user: PickedUser) => {
    setReverseUser(user);
  }, []);

  return (
    <>
      <Typography variant="body1" fontWeight={"700"}>
        反选: 这些用户选择了你，可以选择一位与ta配对
      </Typography>
      <Typography variant="body1" fontWeight={"700"}>
        选择后配对立即生效
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
              <Button variant="contained" onClick={() => onReversePick(user)}>
                选择
              </Button>
            </div>
          );
        })}
      </Box>
      <ConfirmInsistChoosingDialog
        name={reverseUser?.name}
        onConfirm={insistChoosingMutation.mutateAsync}
        onCancel={() => setReverseUser(undefined)}
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

export default PhaseMatchingReverse;
