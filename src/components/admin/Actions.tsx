import { Button, Popconfirm } from 'antd';

interface ActionsProps<T> {
  record: T;
  onEdit: (record: T) => void;
  onDelete: (record: T) => void;
  editLabel?: string;
  deleteLabel?: string;
  deleteConfirmMessage?: string;
  isDeleted?: (record: T) => boolean;
  editButtonType?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
  deleteButtonType?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
  deleteButtonDanger?: boolean;
  popconfirmPlacement?:
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'topLeft'
    | 'topRight'
    | 'bottomLeft'
    | 'bottomRight';
  okText?: string;
  cancelText?: string;
  className?: string;
}

export function Actions<T>({
  record,
  onEdit,
  onDelete,
  editLabel = 'Edit',
  deleteLabel = 'Delete',
  deleteConfirmMessage = 'Are you sure you want to delete this item?',
  isDeleted = (record: T) => !!(record as any).deletedAt,
  editButtonType = 'primary',
  deleteButtonType = 'primary',
  deleteButtonDanger = true,
  popconfirmPlacement = 'bottomLeft',
  okText = 'Yes',
  cancelText = 'No',
  className = 'flex space-x-2',
}: ActionsProps<T>) {
  return (
    <div className={className}>
      <Button type={editButtonType} onClick={() => onEdit(record)}>
        {editLabel}
      </Button>

      {!isDeleted(record) && (
        <Popconfirm
          title={deleteConfirmMessage}
          onConfirm={() => onDelete(record)}
          placement={popconfirmPlacement}
          okText={okText}
          cancelText={cancelText}
        >
          <Button type={deleteButtonType} danger={deleteButtonDanger}>
            {deleteLabel}
          </Button>
        </Popconfirm>
      )}
    </div>
  );
}
