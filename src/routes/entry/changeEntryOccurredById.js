/**
 * Copyright (c) 2019 Callan Peter Milne
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
 * OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 * PERFORMANCE OF THIS SOFTWARE.
 */

function changeEntryOccurredById (myjournal) {

  const api = myjournal.expressApp;
  const db = myjournal.db;
  const events = myjournal.events;
  const authz = myjournal.authz;

  return function (req, res) {
    let entryId = req.params.entryId;
    let userId = req.authUser.get("Id");
    let entryUri = `/entry/${entryId}`;

    authz.verifyOwnership(entryUri, userId)
      .then(fetchEntry)
      .then(changeEntryOccurred)
      .then(returnSuccess)
      .catch(onError);

    function fetchEntry () {
      return db.fetchEntryById(entryId);
    }

    function changeEntryOccurred (entry) {
      if ("now" === req.body.newValue) {
        return setEntryOccurredNow();
      }

      if (null === req.body.newValue) {
        return clearEntryOccurred();
      }

      if ('number' === typeof req.body.newValue) {
        return entry.save({
          Occurred: req.body.newValue,
        });
      }

      return clearEntryOccurred();

      function setEntryOccurredNow () {
        return entry.save({
          Occurred: Math.floor(Date.now()/1000),
        });
      }

      function clearEntryOccurred () {
        return entry.save({
          Occurred: null,
        });
      }
    }

    function returnSuccess () {
      res.status(200).send();
    }

    function onError () {
      res.status(400).send();
    }
  }

}

module.exports = changeEntryOccurredById;
