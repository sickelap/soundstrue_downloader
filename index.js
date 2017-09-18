const fs = require('fs');
const tsFetcher = require('m3u8_to_mpegts');
const getContent = require('./get_content');

const manifest_url = 'http://content.jwplatform.com/manifests/';
const event_data_url = 'http://soundstrue-ha.s3.amazonaws.com/oce/self-acceptance-summit/event_data.json';

const events = getContent(event_data_url)
  .then(data => JSON.parse(data))
  .then(events => events.broadcast_events);

events.then(items => {
  //  items.map(item => {
  //    console.log('item', item);
  //  });
  const url = manifest_url + items[0].file + '.m3u8';
  const dir = './downloads/'+items[0].title+'-'+items[0].session+'-'+items[0].subtitle+'/';
  const folder = dir.replace(/\s+/gi, '_');

  if (!fs.existsSync(folder)){
    console.log('Creating folder:', folder);
    fs.mkdirSync(folder);
  } else {
    console.log('Folder exist:', folder);
  }

  tsFetcher({
    uri: url,
    cwd: folder,
    preferLowQuality: false
  }, () => console.log('done'));
});

