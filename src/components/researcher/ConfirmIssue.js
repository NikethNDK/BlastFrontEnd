import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Badge } from 'react-bootstrap';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { confirmIssue } from '../../services/AppinfoService';
import { setResearcherPendingConfirmations } from '../../store/slices/notificationSlice';
import { getIssueItemsByStatus } from '../../services/AppinfoService';
import toast from 'react-hot-toast';
import { PageLayout, PageHeader, PageBody } from '../layout/content';
import './ConfirmIssue.css';

const TABLE_HEADINGS = [
  { label: 'Entry No', colClass: 'rs-cfm-col--entry' },
  { label: 'Item Code', colClass: 'rs-cfm-col--code' },
  { label: 'Item Name', colClass: 'rs-cfm-col--name' },
  { label: 'Quantity', colClass: 'rs-cfm-col--qty' },
  { label: 'Project Code', colClass: 'rs-cfm-col--project-code' },
  { label: 'Project Name', colClass: 'rs-cfm-col--project-name' },
  { label: 'Lab Assistant', colClass: 'rs-cfm-col--lab-assistant' },
  { label: 'Request Date', colClass: 'rs-cfm-col--date' },
  { label: 'Status', colClass: 'rs-cfm-col--status' },
  { label: 'Action', colClass: 'rs-cfm-col--actions' },
];

const ConfirmIssue = ({ userDetails = { name: "", lab: "", designation: "" } }) => {
  const dispatch = useDispatch();
  const reduxUser = useSelector((state) => state.user.user);
  const pendingConfirmations = useSelector(
    (state) => state.notifications?.researcher?.pendingConfirmations || []
  );
  
  const [loading, setLoading] = useState({});

  useEffect(() => {
    fetchPendingConfirmations();
  }, []);

  const fetchPendingConfirmations = async () => {
    try {
      const username = reduxUser?.user_name || userDetails.name || null;
      const data = await getIssueItemsByStatus('RSR-CONFIRM', username);
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
    <PageLayout>
      <PageHeader title="Pending confirmations" />
      <PageBody>
        <div className="confirm-issue-page">
          <section className="project-panel" aria-label="Pending issue confirmations">
            <div className="project-table-section">
              <div className="project-table-shell">
                <table className="project-table">
                  <thead>
                    <tr>
                      {TABLE_HEADINGS.map(({ label, colClass }) => (
                        <th
                          key={colClass}
                          scope="col"
                          className={`rs-cfm-col ${colClass}${
                            colClass === 'rs-cfm-col--actions' ? ' project-th-actions' : ''
                          }`}
                        >
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pendingConfirmations.length === 0 ? (
                      <tr className="project-table-row project-table-row--empty">
                        <td colSpan={10}>
                          <div className="project-empty">
                            <p>No items waiting for your confirmation.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      pendingConfirmations.map((item) => (
                        <tr key={item.entry_no} className="project-table-row">
                          <td className="rs-cfm-col rs-cfm-col--entry">{item.entry_no || '-'}</td>
                          <td className="rs-cfm-col rs-cfm-col--code">{item.item_code || '-'}</td>
                          <td className="rs-cfm-col rs-cfm-col--name">{item.item_name || '-'}</td>
                          <td className="rs-cfm-col rs-cfm-col--qty">{item.quantity_issued || '-'}</td>
                          <td className="rs-cfm-col rs-cfm-col--project-code">{item.project_code || '-'}</td>
                          <td className="rs-cfm-col rs-cfm-col--project-name">{item.project_name || '-'}</td>
                          <td className="rs-cfm-col rs-cfm-col--lab-assistant">{item.lab_assistant_name || '-'}</td>
                          <td className="rs-cfm-col rs-cfm-col--date">{formatDate(item.issue_date)}</td>
                          <td className="rs-cfm-col rs-cfm-col--status">
                            <Badge bg="warning" text="dark">
                              {item.status || 'RSR-CONFIRM'}
                            </Badge>
                          </td>
                          <td className="rs-cfm-col rs-cfm-col--actions project-td-actions">
                            <div className="lims-notification-actions">
                              <Button
                                variant="success"
                                size="sm"
                                onClick={() => handleConfirm(item, 'accept')}
                                disabled={loading[item.entry_no]}
                              >
                                <FaCheck />
                                {loading[item.entry_no] ? 'Confirming...' : 'Confirm'}
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleConfirm(item, 'decline')}
                                disabled={loading[item.entry_no]}
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
          </section>
        </div>
      </PageBody>
    </PageLayout>
  );
};

export default ConfirmIssue;
