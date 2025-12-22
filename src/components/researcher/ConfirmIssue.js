import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Badge } from 'react-bootstrap';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { confirmIssue } from '../../services/AppinfoService';
import { setResearcherPendingConfirmations } from '../../store/slices/notificationSlice';
import { getIssueItemsByStatus } from '../../services/AppinfoService';
import toast from 'react-hot-toast';

const ConfirmIssue = ({ userDetails = { name: "", lab: "", designation: "" } }) => {
  const dispatch = useDispatch();
  const reduxUser = useSelector((state) => state.user.user);
  const pendingConfirmations = useSelector(
    (state) => state.notifications?.researcher?.pendingConfirmations || []
  );
  
  const [loading, setLoading] = useState({});

  useEffect(() => {
    // Fetch pending confirmations on mount
    fetchPendingConfirmations();
  }, []);

  const fetchPendingConfirmations = async () => {
    try {
      const data = await getIssueItemsByStatus('RSR-CONFIRM');
      dispatch(setResearcherPendingConfirmations(data || []));
    } catch (error) {
      console.error('Error fetching pending confirmations:', error);
      toast.error('Failed to load pending confirmations');
    }
  };

  const handleConfirm = async (item, action) => {
    const username = reduxUser?.user_name || userDetails.name;
    
    if (!username) {
      toast.error('User information not available');
      return;
    }

    setLoading({ ...loading, [item.entry_no]: true });

    try {
      await confirmIssue(item.entry_no, action, username);
      
      if (action === 'accept') {
        toast.success('Item request confirmed successfully');
      } else {
        toast.success('Item request declined');
      }
      
      // Refresh the list
      await fetchPendingConfirmations();
    } catch (error) {
      console.error(`Error ${action}ing issue:`, error);
      toast.error(`Failed to ${action} item request`);
    } finally {
      setLoading({ ...loading, [item.entry_no]: false });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div style={{ width: '100%', backgroundColor: '#f2f5e6', minHeight: '100vh' }}>
      <div
        style={{
          backgroundColor: '#f8fafc',
          padding: '20px',
          borderBottom: '2px solid #e2e8f0',
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            margin: 0,
            fontSize: '1.75rem',
            fontWeight: 600,
            color: '#1e293b',
          }}
        >
          PENDING CONFIRMATIONS
        </h2>
      </div>

      <div style={{ padding: '20px' }}>
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              overflowX: 'auto',
              maxHeight: '600px',
              overflowY: 'auto',
            }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'separate',
                borderSpacing: 0,
                minWidth: '1400px',
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      backgroundColor: '#f8fafc',
                      padding: '14px 12px',
                      textAlign: 'center',
                      border: '1px solid #e2e8f0',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      color: '#1e293b',
                      position: 'sticky',
                      top: 0,
                      zIndex: 10,
                      minWidth: '100px',
                    }}
                  >
                    Entry No
                  </th>
                  <th
                    style={{
                      backgroundColor: '#f8fafc',
                      padding: '14px 12px',
                      textAlign: 'center',
                      border: '1px solid #e2e8f0',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      color: '#1e293b',
                      position: 'sticky',
                      top: 0,
                      zIndex: 10,
                      minWidth: '120px',
                    }}
                  >
                    Item Code
                  </th>
                  <th
                    style={{
                      backgroundColor: '#f8fafc',
                      padding: '14px 12px',
                      textAlign: 'center',
                      border: '1px solid #e2e8f0',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      color: '#1e293b',
                      position: 'sticky',
                      top: 0,
                      zIndex: 10,
                      minWidth: '150px',
                    }}
                  >
                    Item Name
                  </th>
                  <th
                    style={{
                      backgroundColor: '#f8fafc',
                      padding: '14px 12px',
                      textAlign: 'center',
                      border: '1px solid #e2e8f0',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      color: '#1e293b',
                      position: 'sticky',
                      top: 0,
                      zIndex: 10,
                      minWidth: '100px',
                    }}
                  >
                    Quantity
                  </th>
                  <th
                    style={{
                      backgroundColor: '#f8fafc',
                      padding: '14px 12px',
                      textAlign: 'center',
                      border: '1px solid #e2e8f0',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      color: '#1e293b',
                      position: 'sticky',
                      top: 0,
                      zIndex: 10,
                      minWidth: '120px',
                    }}
                  >
                    Project Code
                  </th>
                  <th
                    style={{
                      backgroundColor: '#f8fafc',
                      padding: '14px 12px',
                      textAlign: 'center',
                      border: '1px solid #e2e8f0',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      color: '#1e293b',
                      position: 'sticky',
                      top: 0,
                      zIndex: 10,
                      minWidth: '150px',
                    }}
                  >
                    Project Name
                  </th>
                  <th
                    style={{
                      backgroundColor: '#f8fafc',
                      padding: '14px 12px',
                      textAlign: 'center',
                      border: '1px solid #e2e8f0',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      color: '#1e293b',
                      position: 'sticky',
                      top: 0,
                      zIndex: 10,
                      minWidth: '130px',
                    }}
                  >
                    Lab Assistant
                  </th>
                  <th
                    style={{
                      backgroundColor: '#f8fafc',
                      padding: '14px 12px',
                      textAlign: 'center',
                      border: '1px solid #e2e8f0',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      color: '#1e293b',
                      position: 'sticky',
                      top: 0,
                      zIndex: 10,
                      minWidth: '120px',
                    }}
                  >
                    Request Date
                  </th>
                  <th
                    style={{
                      backgroundColor: '#f8fafc',
                      padding: '14px 12px',
                      textAlign: 'center',
                      border: '1px solid #e2e8f0',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      color: '#1e293b',
                      position: 'sticky',
                      top: 0,
                      zIndex: 10,
                      minWidth: '120px',
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      backgroundColor: '#f8fafc',
                      padding: '14px 12px',
                      textAlign: 'center',
                      border: '1px solid #e2e8f0',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      color: '#1e293b',
                      position: 'sticky',
                      top: 0,
                      zIndex: 10,
                      minWidth: '200px',
                    }}
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {pendingConfirmations.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      style={{
                        textAlign: 'center',
                        padding: '40px',
                        color: '#64748b',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      No items waiting for your confirmation.
                    </td>
                  </tr>
                ) : (
                  pendingConfirmations.map((item, index) => (
                    <tr
                      key={item.entry_no}
                      style={{
                        transition: 'background-color 0.15s',
                        backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f1f5f9';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor =
                          index % 2 === 0 ? '#ffffff' : '#f8fafc';
                      }}
                    >
                      <td
                        style={{
                          textAlign: 'center',
                          border: '1px solid #e2e8f0',
                          padding: '12px',
                          fontSize: '0.875rem',
                          color: '#475569',
                        }}
                      >
                        {item.entry_no || '-'}
                      </td>
                      <td
                        style={{
                          textAlign: 'center',
                          border: '1px solid #e2e8f0',
                          padding: '12px',
                          fontSize: '0.875rem',
                          color: '#475569',
                        }}
                      >
                        {item.item_code || '-'}
                      </td>
                      <td
                        style={{
                          textAlign: 'center',
                          border: '1px solid #e2e8f0',
                          padding: '12px',
                          fontSize: '0.875rem',
                          color: '#475569',
                        }}
                      >
                        {item.item_name || '-'}
                      </td>
                      <td
                        style={{
                          textAlign: 'center',
                          border: '1px solid #e2e8f0',
                          padding: '12px',
                          fontSize: '0.875rem',
                          color: '#475569',
                        }}
                      >
                        {item.quantity_issued || '-'}
                      </td>
                      <td
                        style={{
                          textAlign: 'center',
                          border: '1px solid #e2e8f0',
                          padding: '12px',
                          fontSize: '0.875rem',
                          color: '#475569',
                        }}
                      >
                        {item.project_code || '-'}
                      </td>
                      <td
                        style={{
                          textAlign: 'center',
                          border: '1px solid #e2e8f0',
                          padding: '12px',
                          fontSize: '0.875rem',
                          color: '#475569',
                        }}
                      >
                        {item.project_name || '-'}
                      </td>
                      <td
                        style={{
                          textAlign: 'center',
                          border: '1px solid #e2e8f0',
                          padding: '12px',
                          fontSize: '0.875rem',
                          color: '#475569',
                        }}
                      >
                        {item.lab_assistant_name || '-'}
                      </td>
                      <td
                        style={{
                          textAlign: 'center',
                          border: '1px solid #e2e8f0',
                          padding: '12px',
                          fontSize: '0.875rem',
                          color: '#475569',
                        }}
                      >
                        {formatDate(item.issue_date)}
                      </td>
                      <td
                        style={{
                          textAlign: 'center',
                          border: '1px solid #e2e8f0',
                          padding: '12px',
                          fontSize: '0.875rem',
                        }}
                      >
                        <Badge
                          bg="warning"
                          text="dark"
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                          }}
                        >
                          {item.status || 'RSR-CONFIRM'}
                        </Badge>
                      </td>
                      <td
                        style={{
                          textAlign: 'center',
                          border: '1px solid #e2e8f0',
                          padding: '12px',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            gap: '8px',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleConfirm(item, 'accept')}
                            disabled={loading[item.entry_no]}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              minWidth: '90px',
                              justifyContent: 'center',
                            }}
                          >
                            <FaCheck />
                            {loading[item.entry_no] ? 'Confirming...' : 'Confirm'}
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleConfirm(item, 'decline')}
                            disabled={loading[item.entry_no]}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              minWidth: '90px',
                              justifyContent: 'center',
                            }}
                          >
                            <FaTimes />
                            {loading[item.entry_no] ? 'Declining...' : 'Decline'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmIssue;

