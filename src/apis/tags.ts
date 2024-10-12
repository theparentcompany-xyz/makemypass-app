import { Dispatch, SetStateAction } from 'react';

import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import type { TagType } from '../pages/app/EventGlance/types';

export const createEventTags = ({
  eventId,
  tags,
  setTags,
}: {
  eventId: string;
  tags: TagType;
  setTags: Dispatch<SetStateAction<TagType>>;
}) => {
  privateGateway.post(makeMyPass.addTags(eventId), tags).then((response) => {
    setTags({ tags: response.data.response.tags, showModal: false });
  });
};

export const listTags = ({
  eventId,
  setTags,
}: {
  eventId: string;
  setTags: Dispatch<SetStateAction<TagType>>;
}) => {
  privateGateway.get(makeMyPass.listTags(eventId)).then((response) => {
    setTags({ tags: response.data.response, showModal: true });
  });
};
