import type { WarnE } from '../enums/warn.api.enum'

export type WarnT<T> = { data: T; message: `${WarnE}` }
