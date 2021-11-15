import { SanityClient } from '@sanity/client'
import { constructSanityObjectFromTag } from './helpers'
import { AvailableApis, BikeTagApiResponse, TagData } from '../common/types'
export interface SanityUploadPayload {
  _id: string
  _type: string
  slug: string
}
export type UpdateTagPayload = Partial<TagData> & SanityUploadPayload

function isValidUpdatePayload(utp: UpdateTagPayload) {
  return (
    typeof utp._id === 'string' &&
    typeof utp._type === 'string' &&
    typeof utp.slug === 'string'
  )
}

export async function updateTag(
  client: SanityClient,
  payload: UpdateTagPayload | UpdateTagPayload[]
): Promise<BikeTagApiResponse<any> | BikeTagApiResponse<any>[]> {
  const updatePayloads = Array.isArray(payload) ? payload : [payload]
  const successPayloads = []

  for (let updatePayload of updatePayloads) {
    if (!isValidUpdatePayload(updatePayload)) {
      updatePayload = await constructSanityObjectFromTag(client, updatePayload)
    }

    successPayloads.push(await client.createOrReplace(updatePayload))
  }

  return {
    success: true,
    status: 1,
    source: AvailableApis[AvailableApis.sanity],
    data: successPayloads,
  }
}