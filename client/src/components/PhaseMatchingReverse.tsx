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
  useTheme,
} from "@mui/material";
import CosImage from "./CosImage";
import { GetParticipantResponse, PickedUser } from "../api/matching-event";
import { useAuthState } from "./AuthProvider";
import UserSmallProfile from "./UserSmallProfile";

const PhaseMatchingReverse = () => {
  const { eventId = "" } = useParams();
  const { user } = useAuthState();
  const [reverseUser, setReverseUser] = useState<PickedUser | undefined>();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const usersPickedMeQuery = useQuery(
    ["getUsersPickedMeByUserAndEvent", user!.id, eventId],
    () =>
      matchingEventApi.getUsersPickedMeByUserAndEvent({
        pickedUserId: user!.id,
        matchingEventId: eventId,
      })
  );
  const reverseChoosingMutation = useMutation({
    mutationFn: () =>
      matchingEventApi.reversePickingByUser({
        userId: user!.id,
        eventId,
        madeByUserId: reverseUser?.id ?? "",
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

  const onReversePick = useCallback((user: PickedUser) => {
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
        onConfirm={reverseChoosingMutation.mutateAsync}
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
