import StudentInformationForm from "../forms/StudentInformationForm";
import TeacherInformationForm from "../forms/TracherInformationForm";

const UpdateModal = ({
  selectedType,
  selectedUser,
  setShowUpdateModal,
  setStudents,
  setTeachers,
}) => {
  return (
    <div className="modal fade show d-block">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Update Info</h5>
            <button
              className="btn-close"
              onClick={() => setShowUpdateModal(false)}
            ></button>
          </div>
          <div className="modal-body">
            {selectedType === "student" && (
              <StudentInformationForm
                studentId={selectedUser.studentId}
                readOnly={false} // editable
                onSave={(updatedStudent) => {
                  setStudents((prev) =>
                    prev.map((s) =>
                      s.studentId === updatedStudent.studentId
                        ? updatedStudent
                        : s,
                    ),
                  );
                  setShowUpdateModal(false);
                }}
              />
            )}
            {selectedType === "teacher" && (
              <TeacherInformationForm
                teacherId={selectedUser.teacherId}
                readOnly={false}
                onSave={(updatedTeacher) => {
                  setTeachers((prev) =>
                    prev.map((t) =>
                      t.teacherId === updatedTeacher.teacherId
                        ? updatedTeacher
                        : t,
                    ),
                  );
                  setShowUpdateModal(false);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateModal;
