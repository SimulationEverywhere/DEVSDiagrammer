/**
 * BSD 2-Clause License
 *
 * Copyright (c) 2018, Laouen Mayal Louan Belloli
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 *
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

#ifndef DEVSDIAGRAMMER_DYNAMIC_JSON_EXPORTER_HPP
#define DEVSDIAGRAMMER_DYNAMIC_JSON_EXPORTER_HPP

#include <iostream>
#include <string>

#include <boost/property_tree/ptree.hpp>
#include <boost/property_tree/json_parser.hpp>
#include <boost/core/demangle.hpp>

#include <cadmium/modeling/dynamic_atomic.hpp>
#include <cadmium/modeling/dynamic_coupled.hpp>
#include <cadmium/modeling/ports.hpp>

using boost::property_tree::ptree;
using boost::property_tree::write_json;

template<typename TIME>
class dynamic_atomic_cadmium_to_json {

    void ports_to_json(ptree &json_model, cadmium::dynamic::modeling::Ports ports, cadmium::port_kind out_in) {
        if (ports.empty()) {
            return;
        }

        ptree json_ports_list;
        ptree current_json_port;

        for (auto& port : ports) {

            std::string port_type = boost::core::demangle(port.name());
            port_type = port_type.substr(port_type.find_last_of(':')+1);

            current_json_port.clear();
            current_json_port.put("name", port_type);
            current_json_port.put("message_type", "--"); // TODO(Lao): check how to get the message type if possible

            if (out_in == cadmium::port_kind::out) {
                current_json_port.put("port_kind", "out");
            } else {
                current_json_port.put("port_kind", "in");
            }

            json_ports_list.push_back(std::make_pair("", current_json_port));
        }

        if (out_in == cadmium::port_kind::out) {
            json_model.add_child("out", json_ports_list);
        } else {
            json_model.add_child("in", json_ports_list);
        }
    }

public:
    dynamic_atomic_cadmium_to_json() = default;

    void export_to_json(std::shared_ptr<cadmium::dynamic::modeling::atomic_abstract<TIME>> model, ptree& json_model) {

        json_model.put("id", model->get_id());
        json_model.put("type", "atomic");

        ptree json_ports_model;
        cadmium::dynamic::modeling::Ports output_ports = model->get_output_ports();
        cadmium::dynamic::modeling::Ports input_ports = model->get_input_ports();

        this->ports_to_json(json_ports_model, output_ports, cadmium::port_kind::out);
        this->ports_to_json(json_ports_model, input_ports, cadmium::port_kind::in);

        if (!json_ports_model.empty()) {
            json_model.add_child("ports", json_ports_model);
        }
    }

    std::ostream& print_to_json(std::shared_ptr<cadmium::dynamic::modeling::atomic_abstract<TIME>> model, std::ostream& os) {
        ptree json_model;
        this->export_to_json(model, json_model);

        write_json(os, json_model, true);
        return os;
    }
};

template<typename TIME>
class dynamic_coupled_cadmium_to_json {

    void ic_to_json(ptree &json_model, cadmium::dynamic::modeling::ICs& ics) {
        ptree json_IC_list;
        ptree current_json_ic;


        for (auto& ic : ics) {
            std::string from_port_type = boost::core::demangle(ic._link->from_port_type_index().name());
            from_port_type = from_port_type.substr(from_port_type.find_last_of(':')+1);

            std::string to_port_type = boost::core::demangle(ic._link->to_port_type_index().name());
            to_port_type = to_port_type.substr(to_port_type.find_last_of(':')+1);

            current_json_ic.clear();
            current_json_ic.put("from_model", ic._from);
            current_json_ic.put("from_port", from_port_type);
            current_json_ic.put("to_model", ic._to);
            current_json_ic.put("to_port", to_port_type);
            json_IC_list.push_back(std::make_pair("", current_json_ic));
        }

        if (!json_IC_list.empty()) {
            json_model.add_child("ic", json_IC_list);
        }
    }

    void eic_to_json(ptree &json_model, cadmium::dynamic::modeling::EICs& eics) {
        ptree json_EIC_list;
        ptree current_json_ic;

        for (auto& eic : eics) {

            std::string from_port_type = boost::core::demangle(eic._link->from_port_type_index().name());
            from_port_type = from_port_type.substr(from_port_type.find_last_of(':')+1);

            std::string to_port_type = boost::core::demangle(eic._link->to_port_type_index().name());
            to_port_type = to_port_type.substr(to_port_type.find_last_of(':')+1);

            current_json_ic.clear();
            current_json_ic.put("from_port", from_port_type);
            current_json_ic.put("to_model", eic._to);
            current_json_ic.put("to_port", to_port_type);
            json_EIC_list.push_back(std::make_pair("", current_json_ic));
        }

        if (!json_EIC_list.empty()) {
            json_model.add_child("eic", json_EIC_list);
        }
    }

    void eoc_to_json(ptree &json_model, cadmium::dynamic::modeling::EOCs& eocs) {
        ptree json_EOC_list;
        ptree current_json_ic;

        for (auto& eoc : eocs) {

            std::string from_port_type = boost::core::demangle(eoc._link->from_port_type_index().name());
            from_port_type = from_port_type.substr(from_port_type.find_last_of(':')+1);

            std::string to_port_type = boost::core::demangle(eoc._link->to_port_type_index().name());
            to_port_type = to_port_type.substr(to_port_type.find_last_of(':')+1);

            current_json_ic.clear();
            current_json_ic.put("from_model", eoc._from);
            current_json_ic.put("from_port", from_port_type);
            current_json_ic.put("to_port", to_port_type);
            json_EOC_list.push_back(std::make_pair("", current_json_ic));
        }

        if (!json_EOC_list.empty()) {
            json_model.add_child("eoc", json_EOC_list);
        }
    }

    void ports_to_json(ptree &json_model, cadmium::dynamic::modeling::Ports& ports, cadmium::port_kind out_in) {
        if (ports.empty()) {
            return;
        }

        ptree json_ports_list;
        ptree current_json_port;

        for (auto& port : ports) {

            std::string port_type = boost::core::demangle(port.name());
            port_type = port_type.substr(port_type.find_last_of(':')+1);

            current_json_port.put("name", port_type);
            current_json_port.put("message_type", "--"); // TODO(Lao): check how to get the message type if possible

            if (out_in == cadmium::port_kind::out) {
                current_json_port.put("port_kind", "out");
            } else {
                current_json_port.put("port_kind", "in");
            }

            json_ports_list.push_back(std::make_pair("", current_json_port));
        }

        if (out_in == cadmium::port_kind::out) {
            json_model.add_child("out", json_ports_list);
        } else {
            json_model.add_child("in", json_ports_list);
        }
    }

    void sub_models_to_json(ptree &json_model, cadmium::dynamic::modeling::Models &sub_models) {
        ptree json_sub_models_list;
        ptree current_json_submodel;

        for (auto& model : sub_models) {
            current_json_submodel.clear();

            std::shared_ptr<cadmium::dynamic::modeling::coupled<TIME>> m_coupled = std::dynamic_pointer_cast<cadmium::dynamic::modeling::coupled<TIME>>(model);
            std::shared_ptr<cadmium::dynamic::modeling::atomic_abstract<TIME>> m_atomic = std::dynamic_pointer_cast<cadmium::dynamic::modeling::atomic_abstract<TIME>>(model);

            if (m_coupled == nullptr) {
                if (m_atomic == nullptr) {
                    throw std::domain_error("Invalid sub model is neither coupled nor atomic");
                }
                dynamic_atomic_cadmium_to_json<TIME> atomic_exporter;
                atomic_exporter.export_to_json(m_atomic, current_json_submodel);
            } else {
                if (m_atomic != nullptr) {
                    throw std::domain_error("Invalid sub model is defined as both coupled and atomic");
                }
                dynamic_coupled_cadmium_to_json<TIME> coupled_exporter;
                coupled_exporter.export_to_json(m_coupled, current_json_submodel);
            }

            json_sub_models_list.push_back(std::make_pair("", current_json_submodel));
        }

        if (!json_sub_models_list.empty()) {
            json_model.add_child("models", json_sub_models_list);
        }
    }

public:
    dynamic_coupled_cadmium_to_json() = default;

    void export_to_json(std::shared_ptr<cadmium::dynamic::modeling::coupled<TIME>> model, ptree& json_model) {

        json_model.put("id", model->get_id());
        json_model.put("type", "coupled");

        ptree json_ports_model;
        cadmium::dynamic::modeling::Ports output_ports = model->get_output_ports();
        cadmium::dynamic::modeling::Ports input_ports = model->get_input_ports();

        this->ports_to_json(json_ports_model, output_ports, cadmium::port_kind::out);
        this->ports_to_json(json_ports_model, input_ports, cadmium::port_kind::in);

        if (!json_ports_model.empty()) {
            json_model.add_child("ports", json_ports_model);
        }

        this->ic_to_json(json_model, model->_ic);
        this->eic_to_json(json_model, model->_eic);
        this->eoc_to_json(json_model, model->_eoc);

        this->sub_models_to_json(json_model, model->_models);
    }

    std::ostream& print_to_json(std::shared_ptr<cadmium::dynamic::modeling::coupled<TIME>> model, std::ostream& os) {
        ptree json_model;
        this->export_to_json(model, json_model);
        write_json(os, json_model, true);
        return os;
    }
};


template<typename TIME>
void dynamic_export_model_to_json(std::ostream& os, std::shared_ptr<cadmium::dynamic::modeling::coupled<TIME>>& model) {

    dynamic_coupled_cadmium_to_json<TIME> exporter;
    exporter.print_to_json(model, os);
}

#endif //DEVSDIAGRAMMER_DYNAMIC_JSON_EXPORTER_HPP
