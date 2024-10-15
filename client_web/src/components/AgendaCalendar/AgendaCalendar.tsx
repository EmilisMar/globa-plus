import './AgendaCalendar.css'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { DateSelectArg, EventSourceInput } from '@fullcalendar/core/index.js'
import type { EventImpl } from '@fullcalendar/core/internal'
import en from '@fullcalendar/core/locales/en-gb'
import lt from '@fullcalendar/core/locales/lt'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'

import { API_PATCH_ProviderVisit } from '../../apis/entities/visits.api.entity'
import { Color } from '../../styles/base.style'
import { getL } from '../../utils/i18n.util'
import { SelectBaseAPI } from '../BuilderForm/components/Select/Select'

export const AgendaCalendar = ({
	pid,
	events,
	setOnNewVisit,
}: {
	pid: string
	events: EventSourceInput
	setOnNewVisit: (e: DateSelectArg) => void
}) => {
	const nav = useNavigate()
	const [tt, setTt] = useState<{ v: boolean; c: string; x: number; y: number }>({
		v: false,
		c: '',
		x: 0,
		y: 0,
	})

	const showTooltip = (e: { el: HTMLElement }, c: string): void => {
		const r = e.el.getBoundingClientRect() as DOMRect
		setTt({ v: true, c, x: r.left + window.scrollX, y: r.top + window.scrollY - 50 })
	}

	const hideTooltip = (): void => {
		setTt({ v: false, c: '', x: 0, y: 0 })
	}

	return (
		<div className="overflow-auto rounded-lg bg-[--white]">
			<div className="my-2 mb-4 w-fit">
				<SelectBaseAPI initVal={pid} entity="workers" />
			</div>
			<FullCalendar
				plugins={[interactionPlugin, dayGridPlugin, timeGridPlugin]}
				initialView="dayGridMonth"
				headerToolbar={{
					left: `prev,next today`,
					center: 'title',
					right: 'dayGridMonth,timeGridWeek',
				}}
				businessHours={{ daysOfWeek: [1, 2, 3, 4, 5], startTime: '09:00', endTime: '18:00' }}
				droppable
				editable
				locale={getL()}
				titleFormat={{ year: 'numeric', month: 'long' }}
				locales={[en, lt]}
				eventBackgroundColor={Color.Primary}
				eventBorderColor={Color.Primary}
				eventColor={Color.Primary}
				eventDrop={updateEvent}
				eventResize={updateEvent}
				eventStartEditable
				events={events}
				firstDay={1}
				height={600}
				nowIndicator
				select={setOnNewVisit}
				selectable
				weekends
				eventClick={(e) => nav(`/provider/dashboard/visits/${e.event.id}`)}
				eventMouseEnter={(e) => showTooltip(e, e.event.extendedProps.recipientName)}
				eventMouseLeave={hideTooltip}
			/>
			{tt.v && (
				<div
					className={`bg-red-500 absolute z-10 rounded-md bg-[--Primary] px-4 py-2 text-white`}
					style={{ left: tt.x, top: tt.y }}
				>
					{tt.c}
				</div>
			)}
		</div>
	)
}

const updateEvent = async (e: { event: EventImpl }) => {
	if (!e.event.start || !e.event.end) return
	await API_PATCH_ProviderVisit(e.event.id, {
		timeFrom: e.event.start.toISOString(),
		timeTo: e.event.end.toISOString(),
	})
}
