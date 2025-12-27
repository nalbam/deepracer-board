'use client';

import { useState } from 'react';
import { Modal } from '@/components/common/modal';
import { AlertTriangle } from 'lucide-react';

interface DeleteLeagueModalProps {
  isOpen: boolean;
  onClose: () => void;
  leagueCode: string;
  leagueTitle: string;
  onDelete: () => void;
}

export function DeleteLeagueModal({
  isOpen,
  onClose,
  leagueCode,
  leagueTitle,
  onDelete,
}: DeleteLeagueModalProps) {
  const [inputValue, setInputValue] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (inputValue !== leagueCode) {
      setError('리그 코드가 일치하지 않습니다.');
      return;
    }

    setIsDeleting(true);
    setError('');

    try {
      // 레이서 삭제
      const racersResponse = await fetch(`/api/racers/${leagueCode}`, {
        method: 'DELETE',
      });

      if (!racersResponse.ok) {
        throw new Error('레이서 삭제에 실패했습니다.');
      }

      // 리그 삭제
      const leagueResponse = await fetch(`/api/leagues/${leagueCode}`, {
        method: 'DELETE',
      });

      if (!leagueResponse.ok) {
        throw new Error('리그 삭제에 실패했습니다.');
      }

      // 성공
      onDelete();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : '삭제 중 오류가 발생했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    setInputValue('');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="리그 삭제">
      <div className="modal-warning">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <AlertTriangle className="w-5 h-5" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <p className="modal-warning-text" style={{ fontWeight: 'bold', marginBottom: '4px' }}>
              이 작업은 되돌릴 수 없습니다!
            </p>
            <p className="modal-warning-text">
              리그와 모든 레이서 데이터가 영구적으로 삭제됩니다.
            </p>
          </div>
        </div>
      </div>

      <div className="modal-info">
        <p className="modal-info-text" style={{ fontWeight: 'bold', marginBottom: '4px' }}>
          삭제할 리그: {leagueTitle}
        </p>
        <p className="modal-info-text">
          리그 코드: <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{leagueCode}</span>
        </p>
      </div>

      <div className="modal-form-group">
        <label className="modal-form-label">
          계속하려면 리그 코드 <strong>{leagueCode}</strong>를 입력하세요:
        </label>
        <input
          type="text"
          className="modal-form-input"
          placeholder={leagueCode}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setError('');
          }}
          disabled={isDeleting}
        />
        {error && (
          <p style={{ color: '#fca5a5', fontSize: '14px', marginTop: '8px' }}>
            {error}
          </p>
        )}
      </div>

      <div className="modal-footer">
        <button
          className="btn-link btn-secondary"
          onClick={handleClose}
          disabled={isDeleting}
        >
          취소
        </button>
        <button
          className="btn-link btn-danger"
          onClick={handleDelete}
          disabled={isDeleting || inputValue !== leagueCode}
        >
          {isDeleting ? '삭제 중...' : '리그 삭제'}
        </button>
      </div>
    </Modal>
  );
}
