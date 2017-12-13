// @flow
import {normalize} from 'normalizr';
import uuid from 'uuid/v1';
import {flowRight} from 'lodash';
import pickBy from 'lodash/pickBy';
import includes from 'lodash/includes';
import assign from 'lodash/assign';

import {hearingSchema} from '../types';

const ATTR_WITH_FRONT_ID = [
  'sections',
  'labels',
  'contact_persons',
];

export const fillFrontId = (
  obj: {frontId: ?string, id: ?string},
  idGenerator: () => string = uuid
) => (
  {
    ...obj,
    frontId: obj.frontId || obj.id || idGenerator(),
  }
);

export const fillFrontIds = (thingz: Array<Object>, idGenerator: () => string = uuid) =>
  thingz.map((thing) => fillFrontId(thing, idGenerator));

export const normalizeEntitiesByFrontId = (data: Object, entityKey: string, idGenerator: () => string = uuid) =>
  normalize({
    ...data,
    [entityKey]: fillFrontIds(data[entityKey], idGenerator),
  }, hearingSchema).entities[entityKey] || {};

export const normalizeHearing = (hearing: Object) =>
  normalize(hearing, hearingSchema);

export const fillFrontIdsForAttributes = (data: Object, attrKeys: Array<string> = ATTR_WITH_FRONT_ID) => ({
  ...data,
  ...attrKeys.reduce((filled, key) => ({
    ...filled,
    [key]: fillFrontIds(data[key]),
  }), {})
});

export const removeFrontId = (obj: Object) => {
  const result = {...obj};
  delete result.frontId;
  return result;
};

export const filterFrontIds = (thingz: Array<Object>) =>
  thingz.map(removeFrontId);

export const filterFrontIdsFromAttributes = (data: Object, attrKeys: Array<string> = ATTR_WITH_FRONT_ID) => ({
  ...data,
  ...attrKeys.reduce((filtered, key) => ({
    ...filtered,
    [key]: filterFrontIds(data[key]),
  }), {})
});

const filterTitleByLanguages = (title, languages) => pickBy(title, (value, key) => includes(languages, key));
const filterSectionsContentByLanguages = (sections, languages) => {
  return sections.map((section) => assign(
    section,
    {
      title: pickBy(section.title, (value, key) => includes(languages, key)),
      content: pickBy(section.content, (value, key) => includes(languages, key)),
    }
  ));
};

export const filterTitleAndContentByLanguage = (data, languages) => assign(
  data,
  {
    title: filterTitleByLanguages(data.title, languages),
    sections: filterSectionsContentByLanguages(data.sections, languages),
  }
);

export const fillFrontIdsAndNormalizeHearing = flowRight([normalizeHearing, fillFrontIdsForAttributes]);
