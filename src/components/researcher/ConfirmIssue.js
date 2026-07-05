import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Badge } from 'react-bootstrap';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { confirmIssue } from '../../services/AppinfoService';
import { setResearcherPendingConfirmations } from '../../store/slices/notificationSlice';
import { getIssueItemsByStatus } from '../../services/AppinfoService';
import toast from 'react-hot-toast';
import { PageLayout, PageHeader, PageBody, ContentCard } from '../layout/content';

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
      // Get username from Redux or userDetails for filtering
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
    <PageLayout>
      <PageHeader title="Pending confirmations" />
      <PageBody>
      <ContentCard flush>
        <div className="lims-notification-scroll">
          <table className="lims-notification-table lims-table">
            <thead>
              <tr>
                <th style={{ minWidth: '100px' }}>Entry No</th>
                <th style={{ minWidth: '120px' }}>Item Code</th>
                <th style={{ minWidth: '150px' }}>Item Name</th>
                <th style={{ minWidth: '100px' }}>Quantity</th>
                <th style={{ minWidth: '120px' }}>Project Code</th>
                <th style={{ minWidth: '150px' }}>Project Name</th>
                <th style={{ minWidth: '130px' }}>Lab Assistant</th>
                <th style={{ minWidth: '120px' }}>Request Date</th>
                <th style={{ minWidth: '120px' }}>Status</th>
                <th style={{ minWidth: '200px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingConfirmations.length === 0 ? (
                <tr>
                  <td colSpan={10} className="lims-notification-empty">
                    No items waiting for your confirmation.
                  </td>
                </tr>
              ) : (
                pendingConfirmations.map((item) => (
                  <tr key={item.entry_no}>
                    <td>{item.entry_no || '-'}</td>
                    <td>{item.item_code || '-'}</td>
                    <td>{item.item_name || '-'}</td>
                    <td>{item.quantity_issued || '-'}</td>
                    <td>{item.project_code || '-'}</td>
                    <td>{item.project_name || '-'}</td>
                    <td>{item.lab_assistant_name || '-'}</td>
                    <td>{formatDate(item.issue_date)}</td>
                    <td>
                      <Badge bg="warning" text="dark">
                        {item.status || 'RSR-CONFIRM'}
                      </Badge>
                    </td>
                    <td>
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
      </ContentCard>
      </PageBody>
    </PageLayout>
  );
};

export default ConfirmIssue;
