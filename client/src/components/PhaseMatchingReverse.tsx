import React, { useCallback, useMemo, useState } from "react";
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
  Divider,
  Typography,
} from "@mui/material";
import { useAuthState } from "./AuthProvider";
import UserSmallProfile from "./UserSmallProfile";
import { EventUser } from "../api/matching-event";

const PhaseMatchingReverse = ({ onSuccess }: { onSuccess: () => void }) => {
  const { eventId = "" } = useParams();
  const { user } = useAuthState();
  const [reverseUser, setReverseUser] = useState<EventUser | undefined>();
  const queryClient = useQueryClient();
  const usersPickedMeQuery = useQuery(
    ["getUsersPickedMeByUserAndEvent", user!.id, eventId],
    () =>
      matchingEventApi.getUsersPickedMeByUserAndEvent({
        pickedUserId: user!.id,
        matchingEventId: eventId,
      })
  );
  const reversePickingMutation = useMutation({
    mutationFn: () =>
      matchingEventApi.reversePickingByUser({
        userId: user!.id,
        eventId,
        madeByUserId: reverseUser?.id ?? "",
      }),
    onSuccess: (resp) => {
      onSuccess();
    },
  });

  const onReversePick = useCallback((user: EventUser) => {
    setReverseUser(user);
  }, []);

  return (
    <>
      <Typography variant="body1" fontWeight={"700"}>
        反选: 这些用户选择了你，可以选择一位与ta配对
      </Typography>
      <Typography variant="body1">选择后配对立即生效</Typography>
      <Box
        sx={{
          display: "flex",
          mt: 4,
          flexDirection: "column",
        }}
      >
        {usersPickedMeQuery.data?.map((user) => {
          return (
            <UserSmallProfile user={user} key={user.id}>
              <Button variant="contained" onClick={() => onReversePick(user)}>
                选择
              </Button>
              <Divider sx={{ mt: 2 }} />
            </UserSmallProfile>
          );
        })}
      </Box>
      <ConfirmReverseChoosingDialog
        name={reverseUser?.name}
        onConfirm={reversePickingMutation.mutateAsync}
        onCancel={() => setReverseUser(undefined)}
      />
    </>
  );
};

const ConfirmReverseChoosingDialog = ({
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
        <DialogContentText>确定反选{name}吗？</DialogContentText>
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
