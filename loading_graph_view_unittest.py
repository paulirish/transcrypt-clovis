# Copyright 2016 The Chromium Authors. All rights reserved.
# Use of this source code is governed by a BSD-style license that can be
# found in the LICENSE file.

import unittest

import loading_graph_view
import request_dependencies_lens
from request_dependencies_lens_unittest import TestRequests


class MockContentClassificationLens(object):
  def __init__(self, ad_request_ids, tracking_request_ids):
    self._ad_requests_ids = ad_request_ids
    self._tracking_request_ids = tracking_request_ids

  def IsAdRequest(self, request):
    return request.request_id in self._ad_requests_ids

  def IsTrackingRequest(self, request):
    return request.request_id in self._tracking_request_ids


class LoadingGraphViewTestCase(unittest.TestCase):
  def setUp(self):
    super(LoadingGraphViewTestCase, self).setUp()
    self.trace = TestRequests.CreateLoadingTrace()
    self.deps_lens = request_dependencies_lens.RequestDependencyLens(self.trace)

  def testAnnotateNodesNoLenses(self):
    graph_view = loading_graph_view.LoadingGraphView(self.trace, self.deps_lens)
    for node in graph_view.deps_graph.graph.Nodes():
      self.assertFalse(node.is_ad)
      self.assertFalse(node.is_tracking)
    for edge in graph_view.deps_graph.graph.Edges():
      self.assertFalse(edge.is_timing)

  def testAnnotateNodesContentLens(self):
    ad_request_ids = set([TestRequests.JS_REQUEST_UNRELATED_FRAME.request_id])
    tracking_request_ids = set([TestRequests.JS_REQUEST.request_id])
    content_lens = MockContentClassificationLens(
        ad_request_ids, tracking_request_ids)
    graph_view = loading_graph_view.LoadingGraphView(self.trace, self.deps_lens,
                                                     content_lens)
    for node in graph_view.deps_graph.graph.Nodes():
      request_id = node.request.request_id
      self.assertEqual(request_id in ad_request_ids, node.is_ad)
      self.assertEqual(request_id in tracking_request_ids, node.is_tracking)

  def testRemoveAds(self):
    ad_request_ids = set([TestRequests.JS_REQUEST_UNRELATED_FRAME.request_id])
    tracking_request_ids = set([TestRequests.JS_REQUEST.request_id])
    content_lens = MockContentClassificationLens(
        ad_request_ids, tracking_request_ids)
    graph_view = loading_graph_view.LoadingGraphView(self.trace, self.deps_lens,
                                                     content_lens)
    graph_view.RemoveAds()
    request_ids = set([n.request.request_id
                       for n in graph_view.deps_graph.graph.Nodes()])
    expected_request_ids = set([r.request_id for r in [
        TestRequests.FIRST_REDIRECT_REQUEST,
        TestRequests.SECOND_REDIRECT_REQUEST,
        TestRequests.REDIRECTED_REQUEST,
        TestRequests.REQUEST,
        TestRequests.JS_REQUEST_OTHER_FRAME]])
    self.assertSetEqual(expected_request_ids, request_ids)

  def testRemoveAdsPruneGraph(self):
    ad_request_ids = set([TestRequests.SECOND_REDIRECT_REQUEST.request_id])
    tracking_request_ids = set([])
    content_lens = MockContentClassificationLens(
        ad_request_ids, tracking_request_ids)
    graph_view = loading_graph_view.LoadingGraphView(
        self.trace, self.deps_lens, content_lens)
    graph_view.RemoveAds()
    request_ids = set([n.request.request_id
                       for n in graph_view.deps_graph.graph.Nodes()])
    expected_request_ids = set(
        [TestRequests.FIRST_REDIRECT_REQUEST.request_id])
    self.assertSetEqual(expected_request_ids, request_ids)


if __name__ == '__main__':
  unittest.main()
