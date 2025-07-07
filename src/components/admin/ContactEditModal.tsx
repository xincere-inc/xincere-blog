'use client';

import ApiAdminContact from '@/api/ApiAdminContact';
import { Contact, ContactStatus } from '@prisma/client';
import { Modal, Button, Select, Alert, Form } from 'antd';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

// ContactStatusの値を取得
const contactStatusOptions = [
  { label: 'OPEN', value: ContactStatus.OPEN },
  { label: 'INPROGRESS', value: ContactStatus.INPROGRESS },
  { label: 'CLOSED', value: ContactStatus.CLOSED },
];

interface ContactEditModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  contact: Contact | null;
}

export function ContactEditModal({
  visible,
  onCancel,
  onSuccess,
  contact,
}: ContactEditModalProps) {
  const [status, setStatus] = useState<ContactStatus>(ContactStatus.OPEN);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (visible && contact) {
      setStatus(contact.status);
      setServerError(null);
    }
  }, [visible, contact]);

  const handleUpdate = async () => {
    if (!contact) return;
    setLoading(true);
    setServerError(null);
    try {
      const response = await ApiAdminContact.adminUpdateContact({
        id: contact.id,
        status,
      });
      if (response.status === 200) {
        toast.success(response.data.message || 'Contact updated', {
          position: 'bottom-right',
        });
        onCancel();
        onSuccess();
      } else {
        toast.error(response.data.message || 'Failed to update contact', {
          position: 'bottom-right',
        });
      }
    } catch (error: any) {
      setServerError(error?.response?.data?.error || 'Error updating contact');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Edit Contact Status"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel} className="mr-2">
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleUpdate}
        >
          Update Status
        </Button>,
      ]}
      destroyOnHidden
      centered
    >
      <Form layout="vertical">
        <Form.Item label="Status" required>
          <Select
            value={status}
            onChange={setStatus}
            options={contactStatusOptions}
          />
        </Form.Item>
        {serverError && (
          <Alert message={serverError} type="error" className="mt-2.5" />
        )}
      </Form>
    </Modal>
  );
}
