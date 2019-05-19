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

function changeListTitleById (myjournal) {

  const api = myjournal.expressApp;
  const db = myjournal.db;
  const events = myjournal.events;
  const authz = myjournal.authz;

  return function (req, res) {
    let listId = req.params.listId;
    let userId = req.authUser.get("Id");
    let listUri = `/list/${listId}`;

    authz.verifyOwnership(listUri, userId)
      .then(fetchList)
      .then(changeListTitle)
      .then(returnSuccess)
      .catch(onError);

    function fetchList () {
      return db.fetchListById(listId);
    }

    function changeListTitle (list) {
      return list.save({
        Title: req.body.newValue || 'My List',
      });
    }

    function returnSuccess () {
      res.status(200).send();
    }

    function onError () {
      res.status(400).send();
    }
  }

}

module.exports = changeListTitleById;