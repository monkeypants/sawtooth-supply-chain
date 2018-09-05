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

const m = require('mithril')

const api = require('../services/api')
const payloads = require('../services/payloads')
const transactions = require('../services/transactions')
const parsing = require('../services/parsing')
const {MultiSelect} = require('../components/forms')
const layout = require('../components/layout')

const core_types = require('../../sample_data/core_types.json')
/**
 * Possible selection options
 */
/*const authorizableProperties = [
 * ['location', 'Location'],
 * ['temperature', 'Temperature'],
 * ['tilt', 'Tilt'],
 * ['shock', 'Shock']
 *]
 */
const authorizableProperties = []

const certificateOptions = core_types
  .find(type => type.name === 'certificate').properties
  .find(type => type.name === 'cert_type').enumOptions


/**
 * The Form for tracking a new certificate.
 */
const AddCertForm = {
  oninit (vnode) {
    // Initialize the empty reporters fields
    vnode.state.reporters = [
      {
        reporterKey: '',
        properties: []
      }
    ]
    api.get('agents')
      .then(agents => {
        const publicKey = api.getPublicKey()
        vnode.state.agents = agents.filter(agent => agent.key !== publicKey)
      })
  },

  view (vnode) {
    return m('.cert_form',
             m('form', {
               onsubmit: (e) => {
                 e.preventDefault()
                 _handleSubmit(vnode.attrs.signingKey, vnode.state)
               }
             },
             m('legend', 'Track New Certificate'),
             _formGroup('Serial Number', m('input.form-control', {
               type: 'text',
               oninput: m.withAttr('value', (value) => {
                 vnode.state.serialNumber = value
               }),
               value: vnode.state.serialNumber
             })),

            layout.row([
              _formGroup(
                'Certificate Type (e.g. Certificate of Origin)',
                m('select.form-control', {
                  onchange: m.withAttr('value', (value) => {
                    vnode.state.cert_type = value
                  })}, [
                    m('option', { disabled: true, value: '', selected: 'selected' }),
                    certificateOptions.map((opt) => (
                      m('option', {
                        value: opt
                      }, opt)
                    ))
                  ])
              )]),





            layout.row([
              _formGroup('Harmonized Tariff Code', m('input.form-control', {
                type: 'text',
                oninput: m.withAttr('value', (value) => {
                  vnode.state.tariff_code = value
                }),
                value: vnode.state.tariff_code
              })),
              _formGroup('Certificate Number', m('input.form-control', {
                type: 'text',
                oninput: m.withAttr('value', (value) => {
                  vnode.state.certificate_number = value
                }),
                value: vnode.state.certificate_number
              })),
            ]),
            layout.row([
              _formGroup('Producer', m('input.form-control', {
               type: 'text',
               oninput: m.withAttr('value', (value) => {
                 vnode.state.producer = value
               }),
               value: vnode.state.producer
             })),
              _formGroup('Exporter', m('input.form-control', {
               type: 'text',
               oninput: m.withAttr('value', (value) => {
                 vnode.state.exporter = value
               }),
               value: vnode.state.exporter
             })),
              _formGroup('Importer', m('input.form-control', {
               type: 'text',
               oninput: m.withAttr('value', (value) => {
                 vnode.state.importer = value
               }),
               value: vnode.state.importer
             })),
            ]),
            layout.row([
              _formGroup('Port of Loading', m('input.form-control', {
               type: 'text',
               oninput: m.withAttr('value', (value) => {
                 vnode.state.port_of_loading = value
               }),
                value: vnode.state.port_of_loading
             })),
              _formGroup('Vessel/Aircraft', m('input.form-control', {
               type: 'text',
               oninput: m.withAttr('value', (value) => {
                 vnode.state.vessel_aircraft = value
               }),
               value: vnode.state.vessel_aircraft
             })),
              _formGroup('Date of Departure', m('input.form-control', {
               type: 'text',
               oninput: m.withAttr('value', (value) => {
                 vnode.state.date_of_departure = value
               }),
               value: vnode.state.date_of_departure
             })),
              _formGroup('Port of Discharge', m('input.form-control', {
               type: 'text',
               oninput: m.withAttr('value', (value) => {
                 vnode.state.port_of_discharge = value
               }),
               value: vnode.state.port_of_discharge
             })),
              _formGroup('Final Destination', m('input.form-control', {
               type: 'text',
               oninput: m.withAttr('value', (value) => {
                 vnode.state.final_destination = value
               }),
               value: vnode.state.final_destination
             })),
            ]),
            layout.row([
              _formGroup('Document ID', m('input.form-control', {
               type: 'text',
               oninput: m.withAttr('value', (value) => {
                 vnode.state.document_id = value
               }),
               value: vnode.state.document_id
             })),
              _formGroup('Cross Reference', m('input.form-control', {
               type: 'text',
               oninput: m.withAttr('value', (value) => {
                 vnode.state.cross_reference = value
               }),
               value: vnode.state.cross_reference
             })),
            ]),

             /*layout.row([
              *  _formGroup('Length (m)', m('input.form-control', {
              *   type: 'number',
              *   min: 0,
              *   step: 'any',
              *   oninput: m.withAttr('value', (value) => {
              *     vnode.state.lengthInCM = value
              *   }),
              *   value: vnode.state.lengthInCM
              * })),
              * _formGroup('Weight (kg)', m('input.form-control', {
              *   type: 'number',
              *   step: 'any',
              *   oninput: m.withAttr('value', (value) => {
              *     vnode.state.weightInKg = value
              *   }),
              *   value: vnode.state.weightInKg
              * }))
	      *]),
	      */
	     /*
             layout.row([
               _formGroup('Latitude', m('input.form-control', {
                 type: 'number',
                 step: 'any',
                 min: -90,
                 max: 90,
                 oninput: m.withAttr('value', (value) => {
                   vnode.state.latitude = value
                 }),
                 value: vnode.state.latitude
               })),
               _formGroup('Longitude', m('input.form-control', {
                 type: 'number',
                 step: 'any',
                 min: -180,
                 max: 180,
                 oninput: m.withAttr('value', (value) => {
                   vnode.state.longitude = value
                 }),
                 value: vnode.state.longitude
               }))
             ]),
	      */
             m('.reporters.form-group',
               m('label', 'Authorize Reporters'),

               vnode.state.reporters.map((reporter, i) =>
                 m('.row.mb-2',
                   m('.col-sm-8',
                     m('input.form-control', {
                       type: 'text',
                       placeholder: 'Add reporter by name or public key...',
                       oninput: m.withAttr('value', (value) => {
                         // clear any previously matched values
                         vnode.state.reporters[i].reporterKey = null
                         const reporter = vnode.state.agents.find(agent => {
                           return agent.name === value || agent.key === value
                         })
                         if (reporter) {
                           vnode.state.reporters[i].reporterKey = reporter.key
                         }
                       }),
                       onblur: () => _updateReporters(vnode, i)
                     })),

                   m('.col-sm-4',
                     m(MultiSelect, {
                       label: 'Select Fields',
                       options: authorizableProperties,
                       selected: reporter.properties,
                       onchange: (selection) => {
                         vnode.state.reporters[i].properties = selection
                       }
                     }))))),

             m('.row.justify-content-end.align-items-end',
               m('col-2',
                 m('button.btn.btn-primary',
                   'Create Record')))))
  }
}

/**
 * Update the reporter's values after a change occurs in the name of the
 * reporter at the given reporterIndex. If it is empty, and not the only
 * reporter in the list, remove it.  If it is not empty and the last item
 * in the list, add a new, empty reporter to the end of the list.
 */
const _updateReporters = (vnode, reporterIndex) => {
  let reporterInfo = vnode.state.reporters[reporterIndex]
  let lastIdx = vnode.state.reporters.length - 1
  if (!reporterInfo.reporterKey && reporterIndex !== lastIdx) {
    vnode.state.reporters.splice(reporterIndex, 1)
  } else if (reporterInfo.reporterKey && reporterIndex === lastIdx) {
    vnode.state.reporters.push({
      reporterKey: '',
      properties: []
    })
  }
}

/**
 * Handle the form submission.
 *
 * Extract the appropriate values to pass to the create record transaction.
 */
const _handleSubmit = (signingKey, state) => {
  const recordPayload = payloads.createRecord({
    recordId: state.serialNumber,
    recordType: 'certificate',
    properties: [
      {
        name: 'cert_type',
        enumValue: state.cert_type,
        dataType: payloads.createRecord.enum.ENUM
      },
      {
        name: 'tariff_code',
        stringValue: state.tariff_code,
        dataType: payloads.createRecord.enum.STRING
      },
      {
        name: 'certificate_number',
        stringValue: state.certificate_number,
        dataType: payloads.createRecord.enum.STRING
      },
      {
        name: 'producer',
        stringValue: state.producer,
        dataType: payloads.createRecord.enum.STRING
      },
      {
        name: 'exporter',
        stringValue: state.exporter,
        dataType: payloads.createRecord.enum.STRING
      },
      {
        name: 'importer',
        stringValue: state.importer,
        dataType: payloads.createRecord.enum.STRING
      },
      {
        name: 'port_of_loading',
        stringValue: state.port_of_loading,
        dataType: payloads.createRecord.enum.STRING
      },
      {
        name: 'vessel_aircraft',
        stringValue: state.vessel_aircraft,
        dataType: payloads.createRecord.enum.STRING
      },
      {
        name: 'date_of_departure',
        stringValue: state.date_of_departure,
        dataType: payloads.createRecord.enum.STRING
      },
      {
        name: 'port_of_discharge',
        stringValue: state.port_of_discharge,
        dataType: payloads.createRecord.enum.STRING
      },
      {
        name: 'final_destination',
        stringValue: state.final_destination,
        dataType: payloads.createRecord.enum.STRING
      },
      {
        name: 'document_id',
        stringValue: state.document_id,
        dataType: payloads.createRecord.enum.STRING
      },
      {
        name: 'cross_reference',
        stringValue: state.cross_reference,
        dataType: payloads.createRecord.enum.STRING
      },
    ]
  })

  const reporterPayloads = state.reporters
    .filter((reporter) => !!reporter.reporterKey)
    .map((reporter) => payloads.createProposal({
      recordId: state.serialNumber,
      receivingAgent: reporter.reporterKey,
      role: payloads.createProposal.enum.REPORTER,
      properties: reporter.properties
    }))

  transactions.submit([recordPayload].concat(reporterPayloads), true)
    .then(() => m.route.set(`/certs/${state.serialNumber}`))
}

/**
 * Create a form group (this is a styled form-group with a label).
 */
const _formGroup = (label, formEl) =>
  m('.form-group',
    m('label', label),
    formEl)

module.exports = AddCertForm
