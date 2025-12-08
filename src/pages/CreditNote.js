import React from "react";

const CreditNote = () => {
  return (
    <>
      <link rel="manifest" href="/demo/ecosys/manifest.json" />
      <meta name="theme-color" content="#0f66af" />
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Credit Notes</title>
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css"
        rel="stylesheet"
      />
      <style
        dangerouslySetInnerHTML={{
          __html:
            "\n        :root {\n            --primary-blue: #0f66af;\n            --light-grey: #ced4da;\n            --highlight-yellow: #ffd700;\n        }\n\n        body {\n            font-family: 'Montserrat', sans-serif;\n            overflow-x: hidden;\n        }\n\n        .container-animate {\n            animation: fadeIn 0.5s ease-in;\n        }\n\n        .checkbox-item {\n            display: flex;\n            align-items: center;\n            gap: 8px;\n            padding: 8px 12px;\n            border-radius: 6px;\n            transition: background-color 0.2s;\n        }\n\n        .checkbox-item:hover {\n            background-color: #f3f4f6;\n        }\n\n        .checkbox-item input[type=\"checkbox\"] {\n            width: 18px;\n            height: 18px;\n            accent-color: var(--primary-blue);\n        }\n\n        .card-checkbox {\n            width: 18px;\n            height: 18px;\n            accent-color: var(--primary-blue);\n        }\n\n        .btn-primary-blue {\n            background-color: var(--primary-blue);\n            color: white;\n            transition: all 0.2s ease;\n        }\n\n        .btn-primary-blue:hover {\n            background-color: var(--hover-blue);\n            transform: scale(1.05);\n        }\n\n        header {\n            width: 100%;\n            margin: 0;\n            padding-left: 0;\n            padding-right: 0;\n        }\n\n        @media (max-width: 640px) {\n            .mobile-layout {\n                display: flex;\n                flex-direction: column;\n                width: 100%;\n            }\n\n            .mobile-details-row {\n                width: 100%;\n                margin-bottom: 1rem;\n            }\n\n            .grid-cols-2 {\n                grid-template-columns: 1fr;\n                gap: 0.5rem;\n            }\n\n            .mobile-details-row .flex-details {\n                flex-direction: column;\n                align-items: flex-start;\n                gap: 0.5rem;\n            }\n\n            section {\n                padding: 0;\n            }\n        }\n\n        @media (min-width: 641px) {\n            section {\n                padding: 1rem 1.5rem 2rem;\n            }\n        }\n    ",
        }}
      />
      {/* Main Container */}
      <div className="container-fluid mx-auto px-0">
        <div className="container-animate mx-auto px-0">
          {/* Drawer Menu */}
          <div
            className="fixed top-0 -left-64 w-64 h-full bg-white shadow-lg transition-all duration-300 z-[1000] pt-20"
            id="drawerMenu"
          >
            <img
              src="assets/images/logo/bajaj-logo.svg"
              alt="Bajaj Logo"
              className="absolute top-2.5 left-2.5 h-[50px]"
            />
            <button
              className="absolute top-2.5 right-2.5 text-2xl bg-transparent border-none text-red-600 cursor-pointer z-[1002]"
              id="drawerClose"
            >
              <i className="bi bi-x" />
            </button>
            <ul className="list-none p-0 m-0">
              <li className="p-2.5 px-5">
                <a
                  href="#"
                  className="flex items-center text-gray-800 no-underline hover:text-[var(--primary-blue)]"
                >
                  <i className="bi bi-house-door-fill mr-2.5" /> Home
                </a>
              </li>
              <li className="p-2.5 px-5">
                <a
                  href="#"
                  className="flex items-center text-gray-800 no-underline hover:text-[var(--primary-blue)]"
                >
                  <i className="bi bi-people-fill mr-2.5" /> Leads
                </a>
              </li>
              <li className="p-2.5 px-5">
                <a
                  href="#"
                  className="flex items-center text-gray-500 no-underline hover:text-[var(--primary-blue)]"
                >
                  <i className="bi bi-bar-chart-fill mr-2.5" /> Reports
                </a>
              </li>
              <li className="p-2.5 px-5">
                <a
                  href="#"
                  className="flex items-center text-gray-800 no-underline hover:text-[var(--primary-blue)]"
                >
                  <i className="bi bi-gear-fill mr-2.5" /> Settings
                </a>
              </li>
              <li className="p-2.5 px-5">
                <a
                  href="#"
                  className="flex items-center text-gray-800 no-underline hover:text-[var(--primary-blue)]"
                >
                  <i className="bi bi-box-arrow-right mr-2.5" /> Logout
                </a>
              </li>
            </ul>
          </div>
         
          {/* Credit Notes Section */}
          <section>
            <div className="container mx-auto px-4 py-6 max-w-7xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="sortCreditNotes"
                    className="text-xs font-medium text-gray-600"
                  >
                    Sort by:
                  </label>
                  <select
                    id="sortCreditNotes"
                    className="border border-secondary-grey rounded-md px-2 py-1 text-xs bg-white focus:ring-2 focus:ring-primary-blue"
                  >
                    <option value="date-desc">Date (Newest First)</option>
                    <option value="date-asc">Date (Oldest First)</option>
                    <option value="incentive-desc">
                      Incentive (High to Low)
                    </option>
                    <option value="incentive-asc">
                      Incentive (Low to High)
                    </option>
                  </select>
                  <button
                    id="applySortBtn"
                    className="btn-primary-blue rounded-md px-3 py-1 text-xs font-medium"
                  >
                    Apply
                  </button>
                </div>
                <div className="flex items-center gap-4 ml-auto">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="selectAll"
                      className="card-checkbox"
                    />
                    <label
                      htmlFor="selectAll"
                      className="text-xs font-medium text-gray-600"
                    >
                      Select All
                    </label>
                  </div>
                  <button
                    id="generateInvoiceBtn"
                    className="btn-primary-blue rounded-md px-3 py-1 text-xs font-medium hidden"
                  >
                    Generate Invoice for Selected
                  </button>
                </div>
              </div>
              {/* Invoice Generation Modal */}
              <div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden z-[1000]"
                id="invoiceGenerationModal"
              >
                <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[80vh] flex flex-col">
                  <div className="bg-[var(--primary-blue)] text-white p-3 rounded-t-lg flex justify-between items-center flex-shrink-0">
                    <h5 className="text-base font-medium">Generate Invoice</h5>
                    <button
                      type="button"
                      className="text-white hover:text-gray-200 text-lg"
                      data-modal-close="invoiceGenerationModal"
                    >
                      <i className="bi bi-x-lg" />
                    </button>
                  </div>
                  <div className="p-4 flex-1 overflow-y-auto">
                    <p className="text-sm text-gray-600 mb-4">
                      Select credit notes to include in the invoice:
                    </p>
                    <div className="space-y-2 mb-4" id="creditNoteSelection" />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 text-xs px-3 py-1 rounded"
                        data-modal-close="invoiceGenerationModal"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn-primary-blue rounded-md px-3 py-1 text-xs font-medium"
                        id="confirmGenerateInvoice"
                      >
                        Generate Invoice
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 px-4 sm:px-0">
                {/* Credit Note 1 */}
                <div>
                  <div
                    className="credit-note-card bg-white p-4 rounded-lg shadow-sm"
                    data-credit-note-id={1}
                  >
                    <div className="mobile-layout">
                      {/* Credit Note Details */}
                      <div className="mobile-details-row">
                        <div className="flex justify-between items-center">
                          <h6 className="text-base font-semibold mb-1">
                            Credit Note CR001
                          </h6>
                          <input
                            type="checkbox"
                            className="card-checkbox credit-note-checkbox"
                            data-credit-note-id={1}
                            id="checkbox-1"
                          />
                        </div>
                        <div className="flex-details">
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                            <p className="text-sm text-gray-500">
                              Date:{" "}
                              <span className="font-bold">29-08-2025</span>
                            </p>
                            <p className="text-sm text-gray-500">
                              Total Leads: <span className="font-bold">4</span>
                            </p>
                            <p className="text-sm text-gray-500">
                              No. of Vehicles:{" "}
                              <span className="font-bold">6</span>
                            </p>
                            <p className="text-sm text-gray-500">
                              <i className="bi bi-currency-dollar mr-1" />{" "}
                              Incentive: <span className="font-bold">800</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Credit Note 2 */}
                <div>
                  <div
                    className="credit-note-card bg-white p-4 rounded-lg shadow-sm"
                    data-credit-note-id={2}
                  >
                    <div className="mobile-layout">
                      {/* Credit Note Details */}
                      <div className="mobile-details-row">
                        <div className="flex justify-between items-center">
                          <h6 className="text-base font-semibold mb-1">
                            Credit Note CR002
                          </h6>
                          <input
                            type="checkbox"
                            className="card-checkbox credit-note-checkbox"
                            data-credit-note-id={2}
                            id="checkbox-2"
                          />
                        </div>
                        <div className="flex-details">
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                            <p className="text-sm text-gray-500">
                              Date:{" "}
                              <span className="font-bold">01-09-2025</span>
                            </p>
                            <p className="text-sm text-gray-500">
                              Total Leads: <span className="font-bold">3</span>
                            </p>
                            <p className="text-sm text-gray-500">
                              No. of Vehicles:{" "}
                              <span className="font-bold">5</span>
                            </p>
                            <p className="text-sm text-gray-500">
                              <i className="bi bi-currency-dollar mr-1" />{" "}
                              Incentive: <span className="font-bold">650</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Credit Note 3 */}
                <div>
                  <div
                    className="credit-note-card bg-white p-4 rounded-lg shadow-sm"
                    data-credit-note-id={3}
                  >
                    <div className="mobile-layout">
                      {/* Credit Note Details */}
                      <div className="mobile-details-row">
                        <div className="flex justify-between items-center">
                          <h6 className="text-base font-semibold mb-1">
                            Credit Note CR003
                          </h6>
                          <input
                            type="checkbox"
                            className="card-checkbox credit-note-checkbox"
                            data-credit-note-id={3}
                            id="checkbox-3"
                          />
                        </div>
                        <div className="flex-details">
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                            <p className="text-sm text-gray-500">
                              Date:{" "}
                              <span className="font-bold">03-09-2025</span>
                            </p>
                            <p className="text-sm text-gray-500">
                              Total Leads: <span className="font-bold">5</span>
                            </p>
                            <p className="text-sm text-gray-500">
                              No. of Vehicles:{" "}
                              <span className="font-bold">7</span>
                            </p>
                            <p className="text-sm text-gray-500">
                              <i className="bi bi-currency-dollar mr-1" />{" "}
                              Incentive: <span className="font-bold">950</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default CreditNote;
