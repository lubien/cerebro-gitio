'use strict';

const
  got = require('got')
, debounce = require('p-debounce')
, {memoize} = require('cerebro-tools')
, icon = require('../icon.png')

, keyword = 'gitio'
, ENDPOINT = 'https://git.io/create'
, memoizationSettings = {maxAge: 60 * 1000}

, create = query =>
    got
      .post(ENDPOINT, {body: {url: `https://github.com/${query}`}})
      .then(res => res.body)

, createOnSteroids = debounce(memoize(create, memoizationSettings), 150)

, fn = ({term, display, actions}) => {
  const match = term.match(/^gitio\s+(.+)/)

  if (!match) return;

  const [, input] = match

  // Either the user inputs...
  const fullUrl = input.match(/^https:\/\/github.com\/(.+)/)
  const query = fullUrl
    ? fullUrl[1] // `https://github.com/something` or...
    : input      // `something`...
  // But I need `something`

  createOnSteroids(query)
    .then(code => {
      const url = `https://git.io/${code}`
      display({
        title: url
      , subtitle: 'Enter to copy'
      , clipboard: url
      , onSelect: () => actions.copyToClipboard(url)
      })
    })
};

module.exports = {
  icon
, keyword
, name: 'Shorten GitHub URLs'
, fn
}
