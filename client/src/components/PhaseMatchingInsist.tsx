import React, { useCallback, useMemo, useState } from "react";
import _ from "lodash";
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
  Typography,
  useTheme,
} from "@mui/material";
import CosImage from "./CosImage";
import { GetParticipantResponse, PickedUser } from "../api/matching-event";
import { useAuthState } from "./AuthProvider";

const PhaseMatchingInsist = () => {
  const { eventId = "" } = useParams();
  const { user } = useAuthState();
  const [insistedUser, setInsistedUser] = useState<PickedUser | undefined>();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const pickedUsersQuery = useQuery(
    ["getPickedUsersByUserAndEvent", user!.id, eventId],
    () =>
      matchingEventApi.getMyPickingsByUserAndEvent({
        madeByUserId: user!.id,
        matchingEventId: eventId,
      })
  );
  const insistPickingMutation = useMutation({
    mutationFn: () =>
      matchingEventApi.insistPickingByUser({
        userId: user!.id,
        eventId,
        pickedUserId: insistedUser?.id ?? "",
      }),
    onSuccess: (resp) => {
      // todo: handle success
      // queryClient.setQueryData<GetParticipantResponse>(
      //   ["getParticipantByUserAndEvent", eventId, user!.id],
      //   (prev) => {
      //     return {
      //       ...prev!,
      //       participant: resp,
      //     };
      //   }
      // );
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
          flexDirection: "column",
          margin: theme.spacing(1),
          marginTop: theme.spacing(3),
        }}
      >
        {pickedUsersQuery.data?.map((user) => {
          return (
            <Box key={user.id} sx={{ mb: 8 }}>
              <CosImage cosLocation={user.photoUrl} style={{}} />
              <Typography>{user.name}</Typography>
              <Typography>{user.jobTitle}</Typography>
              <Button variant="contained" onClick={() => onInsist(user)}>
                选择
              </Button>
            </Box>
          );
        })}
      </Box>
      <ConfirmInsistChoosingDialog
        name={insistedUser?.name}
        onConfirm={insistPickingMutation.mutateAsync}
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
