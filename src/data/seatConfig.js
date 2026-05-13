export const TOTAL_SEATS = 36;

export const SESSION_TYPES = {
  major: {
    label: '전공 심화',
    shortLabel: '전공',
    timeLabel: '2시간 50분',
    demoSeconds: 15,
  },
  general: {
    label: '교양/기타',
    shortLabel: '교양',
    timeLabel: '1시간 50분',
    demoSeconds: 7,
  },
  practice: {
    label: '자율 실습',
    shortLabel: '자율',
    timeLabel: '2시간',
    demoSeconds: 10,
  },
};

export const FILTERS = [
  { id: 'all', label: '전체' },
  { id: 'empty', label: '사용 가능' },
  { id: 'active', label: '사용 중' },
  { id: 'broken', label: '수리 필요' },
];

export function createInitialSeats() {
  return Array.from({ length: TOTAL_SEATS }, (_, index) => ({
    id: index + 1,
    status: 'empty',
    type: null,
    remainTime: 0,
    assignedAt: null,
  }));
}
