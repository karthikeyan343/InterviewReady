import React from "react";
import { LeaveInterviewModal } from "./modals/LeaveInterviewModal";
import { EndEarlyModal } from "./modals/EndEarlyModal";
import { HighDemandModal } from "./modals/HighDemandModal";
import { SessionConflictModal } from "./modals/SessionConflictModal";
import { NoAnswerReminderModal } from "./modals/NoAnswerReminderModal";

interface InterviewModalsProps {
  showLeaveModal: boolean;
  showEndEarlyModal: boolean;
  showHighDemandModal: boolean;
  sessionConflictModalOpen: boolean;
  showNoAnswerReminderModal: boolean;
  answeredCount: number;
  totalQuestions: number;
  onCloseLeaveModal: () => void;
  onConfirmLeave: () => void;
  onCloseEndEarlyModal: () => void;
  onConfirmEndAnyway: () => void;
  onReturnToDashboard: () => void;
  onAnswerNow: () => void;
}

export const InterviewModals: React.FC<InterviewModalsProps> = ({
  showLeaveModal,
  showEndEarlyModal,
  showHighDemandModal,
  sessionConflictModalOpen,
  showNoAnswerReminderModal,
  answeredCount,
  totalQuestions,
  onCloseLeaveModal,
  onConfirmLeave,
  onCloseEndEarlyModal,
  onConfirmEndAnyway,
  onReturnToDashboard,
  onAnswerNow,
}) => {
  return (
    <>
      <LeaveInterviewModal
        open={showLeaveModal}
        answeredCount={answeredCount}
        totalQuestions={totalQuestions}
        onClose={onCloseLeaveModal}
        onConfirmLeave={onConfirmLeave}
      />
      <EndEarlyModal
        open={showEndEarlyModal}
        answeredCount={answeredCount}
        totalQuestions={totalQuestions}
        onClose={onCloseEndEarlyModal}
        onConfirmEndAnyway={onConfirmEndAnyway}
      />
      <HighDemandModal
        open={showHighDemandModal}
        onReturnToDashboard={onReturnToDashboard}
      />
      <SessionConflictModal
        open={sessionConflictModalOpen}
        onReturnToDashboard={onReturnToDashboard}
      />
      <NoAnswerReminderModal
        open={showNoAnswerReminderModal}
        onAnswerNow={onAnswerNow}
      />
    </>
  );
};

