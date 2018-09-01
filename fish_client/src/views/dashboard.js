/**
 * Copyright 2017 Intel Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ----------------------------------------------------------------------------
 */
'use strict'

const m = require('mithril')

const Dashboard = {
  view (vnode) {
    return [
      m('.header.text-center.mb-4',
        m('h4', 'Welcome To'),
        m('h1.mb-3', 'CertNet Blockchain'),
        m('h5',
          m('em',
            'Powered by ',
            m('strong', 'Hyperledger Blockchain technology')))),
      m('.blurb',
        m('p',
          m('em', 'Certificate Blockchain Network'),
          '. This demonstrates hyperledger blockchain technology',
          ' applied to a Certification use-case. In this simulation,',
	  ' multiple Agents have (delegated) authority to issue',
	  ' Certificates on behalf of a Regulator.',
	  ' Any node in the network can access and verify',
	  ' certificates. Some nodes may be certificate issuers,'
	  ' other nodes may not have any local authorised Agents.'
	  ' A node without agents could still verify certificates'
	  ' that have been issued at other nodes.'))
    ]
  }
}

module.exports = Dashboard
