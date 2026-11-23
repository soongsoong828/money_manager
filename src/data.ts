export type Schedule = {
  id: string
  date: string
  title: string
  amount: number
}

export const demoDate = '2026-11-23'
export const money = (amount: number) => amount.toLocaleString('ko-KR') + '원'

export const budget = {
  daily: 28_000,
  remaining: 224_000,
  spentPercent: 78,
}

export const goals = [
  { id: 'travel', title: '제주 여행', icon: 'Plane', term: '단기', saved: 420_000, target: 600_000, due: '2026-12-12', color: 'lime' },
  { id: 'camera', title: '새 카메라', icon: 'Camera', term: '단기', saved: 275_000, target: 500_000, due: '2027-01-24', color: 'violet' },
  { id: 'reserve', title: '비상금', icon: 'Shield', term: '장기', saved: 1_200_000, target: 3_000_000, due: '2027-12-31', color: 'peach' },
] as const

export const percent = (saved: number, target: number) => Math.round(saved / target * 100)

export const initialSchedules: Schedule[] = [
  { id: 'friends', date: '2026-11-25', title: '친구들과 저녁 약속', amount: 45_000 },
  { id: 'subscription', date: '2026-11-27', title: '구독 서비스 결제', amount: 14_900 },
  { id: 'family', date: '2026-11-29', title: '가족 생일 선물', amount: 60_000 },
]

export const spending = {
  month: {
    label: '2026년 11월',
    trend: [['1주', 168_000], ['2주', 240_000], ['3주', 218_000], ['4주', 150_000]],
    categories: [['식비', 349_200], ['쇼핑', 194_000], ['교통', 155_200], ['기타', 77_600]],
  },
  year: {
    label: '2026년',
    trend: [['1월', 610_000], ['2월', 590_000], ['3월', 750_000], ['4월', 680_000], ['5월', 710_000], ['6월', 690_000], ['7월', 820_000], ['8월', 760_000], ['9월', 650_000], ['10월', 730_000], ['11월', 776_000]],
    categories: [['식비', 3_521_000], ['쇼핑', 1_941_000], ['교통', 1_478_000], ['기타', 816_000]],
  },
} satisfies Record<string, { label: string; trend: [string, number][]; categories: [string, number][] }>

export const transactions = [
  { title: '동네 마트', category: '식비', date: '2026-11-22', amount: 32_400 },
  { title: '지하철 충전', category: '교통', date: '2026-11-21', amount: 50_000 },
  { title: '온라인 문구점', category: '쇼핑', date: '2026-11-19', amount: 18_500 },
  { title: '점심 식사', category: '식비', date: '2026-10-18', amount: 12_000 },
]
