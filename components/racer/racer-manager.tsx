'use client';

import { useState } from 'react';
import { RacerForm } from './racer-form';
import { Racer } from '@/lib/types';

interface RacerManagerProps {
  league: string;
  leagueTitle: string;
  initialRacers: Racer[];
}

function formatLaptime(milliseconds: number): string {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  const ms = milliseconds % 1000;

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
}

export function RacerManager({ league, leagueTitle, initialRacers }: RacerManagerProps) {
  const [racers, setRacers] = useState<Racer[]>(initialRacers);
  const [selectedRacer, setSelectedRacer] = useState<Racer | null>(null);

  const handleRacerClick = (racer: Racer) => {
    setSelectedRacer(racer);
  };

  const handleSuccess = async () => {
    // 레이서 목록 새로고침
    try {
      const response = await fetch(`/api/racers/${league}`);
      const data = await response.json();
      if (data.success) {
        setRacers(data.data || []);
      }
      // 선택 해제
      setSelectedRacer(null);
    } catch (error) {
      console.error('Failed to refresh racers:', error);
    }
  };

  const sortedRacers = [...racers].sort((a, b) => {
    if (!a.laptime) return 1;
    if (!b.laptime) return -1;
    return a.laptime - b.laptime;
  });

  return (
    <div className="racer-manage-grid">
      {/* 레이서 폼 */}
      <div className="racer-form-section">
        <h2 className="racer-section-title">레이서 추가/수정</h2>
        <RacerForm
          league={league}
          selectedRacer={selectedRacer}
          onSuccess={handleSuccess}
        />
      </div>

      {/* 현재 레이서 목록 */}
      <div className="racer-list-section">
        <h2 className="racer-section-title">
          현재 레이서 ({racers.length}명)
        </h2>
        {racers.length === 0 ? (
          <div className="racer-empty">
            등록된 레이서가 없습니다
          </div>
        ) : (
          <div className="racer-list">
            {sortedRacers.map((racer, index) => (
              <div
                key={racer.email}
                className={`racer-item ${selectedRacer?.email === racer.email ? 'racer-item-selected' : ''}`}
                onClick={() => handleRacerClick(racer)}
              >
                <div className="racer-item-info">
                  <span className="racer-rank">#{index + 1}</span>
                  <div className="racer-details">
                    <div className="racer-name">{racer.racerName}</div>
                    <div className="racer-email">{racer.email}</div>
                  </div>
                </div>
                <div className="racer-laptime">
                  {racer.laptime ? (
                    <span className="laptime">{formatLaptime(racer.laptime)}</span>
                  ) : (
                    <span className="no-record">기록 없음</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
