import { useEffect, useRef, useState } from 'react'
import {
  ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, Camera,
  ChartNoAxesColumnIncreasing, ChevronLeft, ChevronRight, CircleAlert, House, Menu,
  PiggyBank, Plane, Plus, Settings, Shield, Wallet, X,
} from 'lucide-react'
import type { FormEvent } from 'react'
import { budget, demoDate, goals, initialSchedules, money, percent, spending, transactions } from './data'
import type { Schedule } from './data'

const pages = [
  { key: 'home', name: '홈', icon: House },
  { key: 'spending', name: '소비 분석', icon: ChartNoAxesColumnIncreasing },
  { key: 'calendar', name: '일정 관리', icon: CalendarDays },
  { key: 'savings', name: '저축 관리', icon: PiggyBank },
]
const goalIcons = { Plane, Camera, Shield }
const route = () => window.location.hash.slice(1) || 'home'
const shortDate = (date: string) => {
  const [, month, day] = date.split('-').map(Number)
  return month + '월 ' + day + '일'
}

function Brand() {
  return <a className="brand" href="#home"><span className="brand-icon"><Wallet size={20} /></span>머니로그<span className="brand-dot">.</span></a>
}

function SectionLink({ title, to }: { title: string; to: string }) {
  return <div className="section-head"><h2>{title}</h2><a href={to}>전체 보기 <ChevronRight size={16} /></a></div>
}

function GoalRow({ goal }: { goal: typeof goals[number] }) {
  const Icon = goalIcons[goal.icon]
  const completion = percent(goal.saved, goal.target)
  return <a className="goal-row" href={'#savings/' + goal.id}>
    <span className={'item-icon ' + goal.color}><Icon size={19} /></span>
    <div className="item-content"><div className="item-top"><strong>{goal.title}</strong><b>{completion}%</b></div>
      <div className="item-meta">{money(goal.saved)} / {money(goal.target)}</div>
      <progress aria-label={goal.title + ' 달성률'} max="100" value={completion} />
    </div>
  </a>
}

function Home({ schedules }: { schedules: Schedule[] }) {
  const upcoming = schedules.filter(item => item.date >= demoDate).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3)
  return <>
    <div className="intro"><div className="eyebrow"><span /> 2026년 11월 23일 월요일</div>
      <h1>나의 돈 관리<span>.</span></h1><p>오늘의 예산부터 다가오는 목표까지 한눈에 살펴보세요.</p>
    </div>
    <div className="budget-grid">
      <a href="#spending" className="budget-card daily">
        <div className="card-top"><span className="card-icon"><Wallet size={19} /></span><ArrowUpRight size={21} /></div>
        <div className="budget-label">오늘의 생활비 기준액</div><div className="budget-number">{money(budget.daily)}</div>
        <div className="budget-note">가상 예산으로 보는 하루 지출 기준</div>
      </a>
      <a href="#spending" className="budget-card monthly">
        <div className="card-top"><span className="card-icon"><ChartNoAxesColumnIncreasing size={19} /></span><ArrowUpRight size={21} /></div>
        <div className="budget-label">이번 달 남은 생활비</div><div className="budget-number">{money(budget.remaining)}</div>
        <div className="budget-meter"><progress value={budget.spentPercent} max="100" aria-label="이번 달 예산 사용률" /><span>{budget.spentPercent}% 사용</span></div>
      </a>
    </div>
    <a href="#spending" className="warning"><span className="warning-icon"><CircleAlert size={19} /></span><div><strong>이번 달 생활비의 {budget.spentPercent}%를 사용했어요</strong><p>남은 예산과 최근 지출을 확인해 보세요.</p></div><ChevronRight size={19} className="trailing" /></a>
    <div className="home-columns">
      <section><SectionLink title="단기 저축 목표" to="#savings" /><div className="panel">{goals.filter(goal => goal.term === '단기').map(goal => <GoalRow key={goal.id} goal={goal} />)}</div></section>
      <section><SectionLink title="다가오는 일정" to="#calendar" /><div className="panel">{upcoming.length ? upcoming.map(item => <a className="schedule-row" href={'#calendar/' + item.date} key={item.id}>
        <span className="date-tile"><small>{Number(item.date.slice(5, 7))}월</small><b>{Number(item.date.slice(8))}</b></span>
        <strong>{item.title}</strong><span className="schedule-amount">{money(item.amount)}</span>
      </a>) : <p className="empty">다가오는 일정이 없어요.</p>}</div></section>
    </div>
  </>
}

function PageHeading({ title, description }: { title: string; description: string }) {
  return <div className="intro"><a className="back" href="#home"><ArrowLeft size={16} /> 홈으로</a><h1>{title}<span>.</span></h1><p>{description}</p></div>
}

function Spending() {
  const [period, setPeriod] = useState<'month' | 'year'>('month')
  const view = spending[period]
  const peak = Math.max(...view.trend.map(([, amount]) => amount))
  const total = view.categories.reduce((sum, [, amount]) => sum + amount, 0)
  return <>
    <PageHeading title="소비 분석" description="생활비 지출 추이와 카테고리별 소비를 확인하세요." />
    <div className="section-head period"><h2>{view.label}</h2><div className="segmented" aria-label="조회 기간">
      <button aria-pressed={period === 'month'} onClick={() => setPeriod('month')}>월별</button>
      <button aria-pressed={period === 'year'} onClick={() => setPeriod('year')}>연도별</button>
    </div></div>
    <div className="home-columns charts">
      <section className="panel padded"><h2>생활비 지출 추이</h2><div className="bar-chart">
        {view.trend.map(([label, amount]) => <div key={label} className="bar-column" title={label + ' ' + money(amount)}><div className="bar-track"><div role="img" aria-label={label + ' ' + money(amount)} style={{ height: (amount / peak * 100) + '%' }} /></div><small>{label}</small></div>)}
      </div></section>
      <section className="panel padded"><h2>카테고리별 소비</h2><div className="categories">{view.categories.map(([name, amount]) => <div key={name}><div className="item-top"><strong>{name}</strong><span>{money(amount)}</span></div><progress aria-label={name + ' 비중'} value={amount} max={total} /></div>)}</div></section>
    </div>
    <section className="stack"><div className="section-head"><h2>거래내역</h2></div><div className="panel">
      {transactions.filter(item => period === 'year' || item.date.startsWith('2026-11')).map(item => <div className="schedule-row" key={item.date}><span className="item-icon lime"><ArrowDownRight size={18} /></span><div className="item-content"><strong>{item.title}</strong><div className="item-meta">{shortDate(item.date)} · {item.category}</div></div><b>{money(item.amount)}</b></div>)}
    </div></section>
  </>
}

function Calendar({ selected, schedules, onSave }: { selected: string; schedules: Schedule[]; onSave: (item: Schedule) => void }) {
  const [year, month] = selected.split('-').map(Number)
  const [editor, setEditor] = useState<Schedule | null>(null)
  const nextScheduleId = useRef(0)
  const firstDay = new Date(year, month - 1, 1).getDay()
  const days = new Date(year, month, 0).getDate()
  const dateFor = (day: number) => selected.slice(0, 8) + String(day).padStart(2, '0')
  const switchMonth = (step: number) => {
    const next = new Date(year, month - 1 + step, 1)
    window.location.hash = 'calendar/' + next.getFullYear() + '-' + String(next.getMonth() + 1).padStart(2, '0') + '-01'
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!editor || !editor.title.trim()) return
    onSave({ ...editor, title: editor.title.trim(), id: editor.id || "new-" + Date.now() + "-" + nextScheduleId.current++ })
    setEditor(null)
  }
  return <>
    <PageHeading title="일정 관리" description="예정된 일정과 예상 지출을 미리 살펴보세요." />
    <div className="home-columns calendar-layout"><section className="panel padded">
      <div className="section-head"><button className="icon-button" onClick={() => switchMonth(-1)} aria-label="이전 달"><ChevronLeft size={20} /></button><h2>{year}년 {month}월</h2><button className="icon-button" onClick={() => switchMonth(1)} aria-label="다음 달"><ChevronRight size={20} /></button></div>
      <div className="calendar-grid">{['일', '월', '화', '수', '목', '금', '토'].map(day => <span key={day}>{day}</span>)}
        {Array.from({ length: firstDay }, (_, index) => <span key={'blank-' + index} />)}
        {Array.from({ length: days }, (_, index) => {
          const day = index + 1
          const date = dateFor(day)
          return <a key={day} href={'#calendar/' + date} aria-label={shortDate(date)} aria-current={selected === date ? 'date' : undefined}>{day}{schedules.some(item => item.date === date) && <i />}</a>
        })}
      </div>
    </section><section><div className="section-head"><h2>{shortDate(selected)} 일정</h2><button className="primary" onClick={() => setEditor({ id: '', title: '', date: selected, amount: 0 })}><Plus size={17} /> 일정 추가</button></div>
      <div className="panel">{schedules.filter(item => item.date === selected).map(item => <button className="schedule-row edit-row" key={item.id} onClick={() => setEditor(item)}><div className="item-content"><strong>{item.title}</strong><div className="item-meta">예상 지출 {money(item.amount)}</div></div><ChevronRight size={17} /></button>)}{!schedules.some(item => item.date === selected) && <p className="empty">등록된 일정이 없어요.</p>}</div>
    </section></div>
    {editor && <div className="overlay"><form className="dialog" role="dialog" aria-modal="true" aria-labelledby="editor-title" onSubmit={submit} onKeyDown={event => { if (event.key === 'Escape') setEditor(null) }}>
      <div className="section-head"><h2 id="editor-title">{editor.id ? '일정 수정' : '일정 추가'}</h2><button type="button" className="icon-button" aria-label="닫기" onClick={() => setEditor(null)}><X size={20} /></button></div>
      <label>일정 이름<input autoFocus required maxLength={60} value={editor.title} onChange={event => setEditor({ ...editor, title: event.target.value })} /></label>
      <label>날짜<input required type="date" value={editor.date} onChange={event => setEditor({ ...editor, date: event.target.value })} /></label>
      <label>예상 지출 (원)<input required type="number" min="0" max="999999999" value={editor.amount} onChange={event => setEditor({ ...editor, amount: Number(event.target.value) })} /></label>
      <button className="primary" type="submit">저장</button>
    </form></div>}
  </>
}

function Savings({ id }: { id?: string }) {
  const goal = goals.find(item => item.id === id)
  if (goal) {
    const Icon = goalIcons[goal.icon]
    const completion = percent(goal.saved, goal.target)
    return <><PageHeading title={goal.title} description={goal.term + ' 저축 목표'} /><section className="panel padded goal-detail">
      <span className={'item-icon ' + goal.color}><Icon size={20} /></span>
      <h2>현재까지 {money(goal.saved)}</h2><progress aria-label="목표 달성률" value={completion} max="100" />
      <div className="item-top"><strong>달성률 {completion}%</strong><span>목표 {money(goal.target)}</span></div>
      <p>목표일 {goal.due.replaceAll('-', '. ')}</p><a className="back" href="#savings"><ArrowLeft size={16} /> 저축 목표 목록</a>
    </section></>
  }
  return <><PageHeading title="저축 관리" description="단기와 장기 목표의 적립 현황을 확인하세요." />
    <div className="home-columns">{['단기', '장기'].map(term => <section key={term}><div className="section-head"><h2>{term} 저축 목표</h2></div><div className="panel">{goals.filter(item => item.term === term).map(item => <GoalRow key={item.id} goal={item} />)}</div></section>)}</div></>
}

export default function App() {
  const [location, setLocation] = useState(route)
  const [menuOpen, setMenuOpen] = useState(false)
  const [schedules, setSchedules] = useState(initialSchedules)
  useEffect(() => {
    function handleHash() {
      setLocation(route())
      setMenuOpen(false)
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])
  const [page, detail] = location.split('/')
  const active = [...pages.map(item => item.key), 'settings'].includes(page) ? page : 'home'
  const selectedDate = /^\d{4}-\d{2}-\d{2}$/.test(detail ?? '') && !Number.isNaN(Date.parse(detail)) ? detail : demoDate
  function saveSchedule(item: Schedule) {
    setSchedules(previous => previous.some(existing => existing.id === item.id) ? previous.map(existing => existing.id === item.id ? item : existing) : [...previous, item])
    window.location.hash = 'calendar/' + item.date
  }
  const navLinks = pages.map(({ key, name, icon: Icon }) => <a key={key} href={'#' + key} onClick={() => setMenuOpen(false)} aria-current={active === key ? 'page' : undefined}><Icon size={19} /><span>{name}</span></a>)

  return <div className="shell">
    <aside className={'sidebar' + (menuOpen ? ' open' : '')}>
      <Brand />
      <nav aria-label="메뉴">{navLinks}<a href="#settings" onClick={() => setMenuOpen(false)} aria-current={active === 'settings' ? 'page' : undefined}><Settings size={19} /><span>설정</span></a></nav>
      <div className="sidebar-note"><span /> 가상 데이터 모드</div>
    </aside>
    <div className="workspace">
      <header className="topbar"><div className="mobile-brand"><Brand /></div><div className="breadcrumb">머니로그 <ChevronRight size={14} /> <strong>{pages.find(item => item.key === active)?.name ?? '설정'}</strong></div>
        <div className="header-actions"><a href="#settings" className="icon-button" aria-label="설정"><Settings size={19} /></a><button type="button" className="icon-button menu-toggle" aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={21} /> : <Menu size={21} />}</button></div>
      </header>
      <main>
        {active === 'home' && <Home schedules={schedules} />}
        {active === 'spending' && <Spending />}
        {active === 'calendar' && <Calendar selected={selectedDate} schedules={schedules} onSave={saveSchedule} />}
        {active === 'savings' && <Savings id={detail} />}
        {active === 'settings' && <><PageHeading title="설정" description="머니로그 프로토타입의 데이터 사용 방식을 확인하세요." /><section className="panel padded"><h2>가상 데이터 모드</h2><p>모든 금액과 거래는 예시입니다. 추가하거나 수정한 일정은 새로고침하면 초기화됩니다.</p><a className="back" href="#home">홈으로 돌아가기 <ArrowRight size={16} /></a></section></>}
      </main>
      <footer>머니로그 <span /> 가상 데이터로 살펴보는 나의 돈 관리</footer>
    </div>
    <nav className="bottom-nav" aria-label="하단 메뉴">{navLinks}</nav>
  </div>
}
