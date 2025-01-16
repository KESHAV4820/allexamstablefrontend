'use strict';

const localHost=`http://127.0.0.1:3000`;

export const VIEWRECORDS_API_URL=`${localHost}/api/v1/records`;
export const VIEWRECORDS_API_LIMIT=25000;//35000;
export const VIEWRECORDS_API_OFFSET=0;

export const VIEWRECORDSBYSTREAMING_API_URL=`${localHost}/api/v1/records-stream`;
export const VIEWRECORDSBYSTREAMING_BATCHSIZE=100;

export const DOWNLOADRECORDS_API_URL=`${localHost}/api/v1/downloadrecords`;

export const FETCHRECORDCOUNT_API_URL=`${localHost}/api/v1/recordcount`;

export const VENUESTATS_API_URL=`${localHost}/api/v1/venuerecords`;
export const VENUESTATS_API_LIMIT=6090000;
export const VENUESTATS_API_OFFSET=0;

export const SUMMARYTABLE_API_URL= `${localHost}/api/v1/summarytablestats`;
export const SUMMARYTABLE_API_LIMIT=6090000;
export const SUMMARYTABLE_API_OFFSET=0;

export const DISTINCT_EXAMNAME_DBUPDATE_URL=`${localHost}/api/v1/databaserecordsupdate`;

