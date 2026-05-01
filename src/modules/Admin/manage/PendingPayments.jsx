import React from "react";

const PendingPayments = ({
  pendingPayments,
  handleApprovePayment,
  handleRejectPayment,
}) => {
  return (
    <div className="card p-4 mb-4">
      <h5>Pending Payments</h5>
      {pendingPayments.length === 0 ? (
        <p>No pending payments.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Bill Name</th>
                <th>Method</th>
                <th>Transaction ID</th>
                <th>Amount Paid</th>
                <th>Due Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingPayments.map((b, idx) => (
                <tr key={idx}>
                  <td>{b.studentName}</td>
                  <td>{b.billName}</td>
                  <td>{b.method}</td>
                  <td>{b.transactionId || "N/A"}</td>
                  <td>{b.amountPaid ?? 0}</td>
                  <td>{b.due ?? 0}</td>
                  <td>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() =>
                        handleApprovePayment(
                          b.studentId,
                          b.billIndex,
                          b.paymentIndex,
                        )
                      }
                    >
                      Approve
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() =>
                        handleRejectPayment(
                          b.studentId,
                          b.billIndex,
                          b.paymentIndex,
                        )
                      }
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PendingPayments;
