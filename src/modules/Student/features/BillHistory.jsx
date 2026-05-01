import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  FaFileInvoiceDollar,
  FaUniversity,
  FaMoneyBillWave,
  FaDownload,
  FaPrint,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";

const BillHistory = ({ studentData }) => {
  const { userId } = studentData;
  const [bills, setBills] = useState([]);

  useEffect(() => {
    const billData = JSON.parse(
      localStorage.getItem(`billHistory_${userId}`) || "[]",
    );
    setBills(billData);
  }, [userId]);

  const handlePrint = () => window.print();

  const handlePay = (index) => {
    const method = prompt("Enter payment method");
    if (!method) return;

    const amount = Number(prompt("Enter payment amount"));
    if (!amount) return;

    const trx = prompt("Enter Transaction ID");
    if (!trx) return;

    const updatedBills = [...bills];
    const bill = updatedBills[index];

    if (amount > bill.due) {
      alert("Amount cannot exceed due");
      return;
    }

    const payment = {
      method,
      amount,
      trxId: trx,
      date: new Date().toLocaleDateString(),
      status: "Pending",
    };

    bill.paymentHistory = bill.paymentHistory || [];
    bill.paymentHistory.push(payment);

    setBills(updatedBills);
    localStorage.setItem(`billHistory_${userId}`, JSON.stringify(updatedBills));
  };

  const handlePDF = async (id) => {
    const element = document.getElementById(id);
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
    pdf.save("bill.pdf");
  };

  return (
    <div className="container py-4">
      {/* HEADER */}
      <div className="mb-4">
        <div
          className="p-4 rounded-4 shadow-sm text-white"
          style={{
            background: "linear-gradient(135deg,#1e3a8a,#2563eb)",
          }}
        >
          <div className="d-flex align-items-center gap-2 mb-2">
            <FaFileInvoiceDollar size={26} />
            <h3 className="m-0 fw-bold">Billing Portal</h3>
          </div>
          <small>University Fee Management System</small>
        </div>
      </div>

      {/* EMPTY */}
      {bills.length === 0 && (
        <div className="alert alert-light border text-center">
          No billing records found
        </div>
      )}

      {/* BILL CARDS */}
      {bills.map((bill, index) => (
        <div
          key={index}
          id={`bill-${index}`}
          className="card border-0 shadow-sm rounded-4 mb-4"
        >
          {/* TOP BAR */}
          <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
            <div>
              <div className="d-flex align-items-center gap-2">
                <FaUniversity className="text-primary" />
                <h6 className="mb-0 fw-bold">{bill.semester}</h6>
              </div>
              <small className="text-muted">{bill.date}</small>
            </div>

            {bill.due === 0 ? (
              <span className="badge bg-success px-3 py-2 d-flex align-items-center gap-1">
                <FaCheckCircle /> Paid
              </span>
            ) : (
              <span className="badge bg-danger px-3 py-2">
                Due: {bill.due} BDT
              </span>
            )}
          </div>

          <div className="card-body">
            <div className="row g-3">
              {/* COURSE TABLE */}
              <div className="col-md-7">
                <div className="p-3 border rounded-4 bg-white">
                  <h6 className="mb-3 text-primary fw-bold">Course Details</h6>

                  <table className="table table-sm align-middle text-center">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Credit</th>
                        <th>Fee</th>
                      </tr>
                    </thead>

                    <tbody>
                      {bill.courses.map((c, i) => (
                        <tr key={i}>
                          <td>{c.courseId}</td>
                          <td>{c.name}</td>
                          <td>{c.credit}</td>
                          <td className="fw-bold text-primary">{c.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SUMMARY */}
              <div className="col-md-5">
                <div className="p-3 border rounded-4 bg-white h-100">
                  <h6 className="mb-3 text-primary fw-bold">Summary</h6>

                  <div className="d-flex justify-content-between mb-2">
                    <span>Total</span>
                    <strong>{bill.totalAmount} BDT</strong>
                  </div>

                  <div className="d-flex justify-content-between mb-2">
                    <span>Paid</span>
                    <span className="text-success">{bill.paid}</span>
                  </div>

                  <div className="d-flex justify-content-between mb-3">
                    <span>Due</span>
                    <span className="text-danger fw-bold">{bill.due}</span>
                  </div>

                  <div className="d-grid gap-2">
                    {bill.due > 0 && (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handlePay(index)}
                      >
                        <FaMoneyBillWave className="me-1" />
                        Pay Now
                      </button>
                    )}

                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handlePDF(`bill-${index}`)}
                    >
                      <FaDownload className="me-1" />
                      Download PDF
                    </button>

                    <button
                      className="btn btn-dark btn-sm"
                      onClick={handlePrint}
                    >
                      <FaPrint className="me-1" />
                      Print
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* PAYMENT HISTORY */}
            {bill.paymentHistory?.length > 0 && (
              <div className="mt-3 p-3 border rounded-4 bg-light">
                <h6 className="mb-3 text-primary fw-bold d-flex align-items-center gap-2">
                  <FaMoneyBillWave />
                  Payment History
                </h6>

                <table className="table table-sm text-center align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Date</th>
                      <th>Method</th>
                      <th>Transaction</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {bill.paymentHistory.map((p, i) => (
                      <tr key={i}>
                        <td>{p.date}</td>
                        <td className="text-uppercase">{p.method}</td>
                        <td>{p.trxId}</td>
                        <td>{p.amount}</td>
                        <td>
                          {p.status === "Pending" && (
                            <span className="badge bg-warning text-dark d-flex align-items-center justify-content-center gap-1">
                              <FaClock /> Pending
                            </span>
                          )}
                          {p.status === "Approved" && (
                            <span className="badge bg-success d-flex align-items-center justify-content-center gap-1">
                              <FaCheckCircle /> Approved
                            </span>
                          )}
                          {p.status === "Rejected" && (
                            <span className="badge bg-danger d-flex align-items-center justify-content-center gap-1">
                              <FaTimesCircle /> Rejected
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BillHistory;
