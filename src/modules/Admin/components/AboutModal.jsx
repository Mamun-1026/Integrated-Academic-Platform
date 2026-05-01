import StudentInformationForm from "../forms/StudentInformationForm";
import TeacherInformationForm from "../forms/TracherInformationForm";

const AboutModal = ({
  selectedType,
  selectedUser,
  setShowAboutModal,
  setStudents,
}) => {
  return (
    <div className="modal fade show d-block">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Details</h5>
            <button
              className="btn-close"
              onClick={() => setShowAboutModal(false)}
            ></button>
          </div>
          <div className="modal-body">
            {selectedType === "student" && (
              <StudentInformationForm
                studentId={selectedUser.studentId}
                readOnly={false}
                onSave={(updatedStudent) => {
                  setStudents((prev) =>
                    prev.map((s) =>
                      s.studentId === updatedStudent.studentId
                        ? updatedStudent
                        : s,
                    ),
                  );
                  setShowAboutModal(false); // close modal
                }}
              />
            )}
            {selectedType === "teacher" && (
              <TeacherInformationForm
                teacherId={selectedUser.teacherId}
                readOnly={true}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
