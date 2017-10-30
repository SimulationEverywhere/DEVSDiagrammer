#ifndef PMGBP_PDEVS_MODEL_JSON_EXPORTER
#define PMGBP_PDEVS_MODEL_JSON_EXPORTER

#include <iostream>
#include <string>

#include <boost/type_index.hpp>
#include <boost/property_tree/ptree.hpp>
#include <boost/property_tree/json_parser.hpp>

#include <cadmium/modeling/message_bag.hpp>

#include "json_exporter_helper.hpp"

using namespace std;

using cadmium::make_message_bags;
using boost::property_tree::ptree;
using boost::property_tree::write_json;

template<typename TIME, template<typename T> class MODEL>
class Atomic_cadmiun_to_json {
    using output_ports=typename MODEL<TIME>::output_ports;
    using input_ports=typename MODEL<TIME>::input_ports;

public:
    Atomic_cadmiun_to_json() = default;

    void export_to_json(ptree& json_model) {

        json_model.put("id", boost::typeindex::type_id<MODEL<TIME>>().pretty_name());
        json_model.put("type", "atomic");

        ptree json_ports_model;
        ports_to_json<TIME, output_ports>(json_ports_model, cadmium::port_kind::out);
        ports_to_json<TIME, input_ports>(json_ports_model, cadmium::port_kind::in);

        if (!json_ports_model.empty()) {
            json_model.add_child("ports", json_ports_model);
        }
    }

    // just to allow the method call with the depth without asking if is an atomic exporter
    void export_to_json(ptree& json_model, int deph) {
        this->export_to_json(json_model);
    }

    void print_to_json(const char* json_file_path) {
        ptree json_model;
        this->export_to_json(json_model);

        std::ostringstream buf;
        ofstream json_file;
        json_file.open (json_file_path);

        write_json (buf, json_model, true);
        json_file << buf.str();

        json_file.close();
    }

    // just to allow the method call with the depth without asking if is an atomic exporter
    void print_to_json(const char* json_file_path, int depth) {
        this->print_to_json(json_file_path);
    }
};

template<typename TIME, template<typename T> class MODEL>
class Cadmium_to_JSON {

    template<typename P>
    using submodels_type=typename MODEL<TIME>::template models<P>;
    using output_ports=typename MODEL<TIME>::output_ports;
    using input_ports=typename MODEL<TIME>::input_ports;
    using eic=typename MODEL<TIME>::external_input_couplings;
    using eoc=typename MODEL<TIME>::external_output_couplings;
    using ic=typename MODEL<TIME>::internal_couplings;

    template<template<typename> class M>
    using coupled_submodel_exporter=Cadmium_to_JSON<TIME, M>;

    template<template<typename> class M>
    using atomic_submodel_exporter=Atomic_cadmiun_to_json<TIME, M>;

public:
    Cadmium_to_JSON() = default;

    void export_to_json(ptree& json_model) {

        json_model.put("id", boost::typeindex::type_id<MODEL<TIME>>().pretty_name());
        json_model.put("type", "coupled");

        IC_to_json<TIME, ic>(json_model);
        EIC_to_json<TIME, eic>(json_model);
        EOC_to_json<TIME, eoc>(json_model);

        ptree json_ports_model;
        ports_to_json<TIME, output_ports>(json_ports_model, cadmium::port_kind::out);
        ports_to_json<TIME, input_ports>(json_ports_model, cadmium::port_kind::in);

        if (!json_ports_model.empty()) {
            json_model.add_child("ports", json_ports_model);
        }

        submodels_to_json<TIME, submodels_type, coupled_submodel_exporter, atomic_submodel_exporter>(json_model);
    }

    void export_to_json(ptree& json_model, int depth) {

        json_model.put("id", boost::typeindex::type_id<MODEL<TIME>>().pretty_name());
        json_model.put("type", "coupled");

        IC_to_json<TIME, ic>(json_model);
        EIC_to_json<TIME, eic>(json_model);
        EOC_to_json<TIME, eoc>(json_model);

        ptree json_ports_model;
        ports_to_json<TIME, output_ports>(json_ports_model, cadmium::port_kind::out);
        ports_to_json<TIME, input_ports>(json_ports_model, cadmium::port_kind::in);

        if (!json_ports_model.empty()) {
            json_model.add_child("ports", json_ports_model);
        }

        submodels_to_json<TIME, submodels_type, coupled_submodel_exporter, atomic_submodel_exporter>(json_model, depth);
    }

    void print_to_json(const std::string& json_file_path) {
        ptree json_model;
        this->export_to_json(json_model);

        std::ostringstream buf;
        ofstream json_file;
        json_file.open (json_file_path);

        write_json (buf, json_model, true);
        json_file << buf.str();

        json_file.close();
    }

    void print_to_json(const std::string& json_file_path, int depth) {
        ptree json_model;
        this->export_to_json(json_model, depth);

        std::ostringstream buf;
        ofstream json_file;
        json_file.open (json_file_path);

        write_json (buf, json_model, true);
        json_file << buf.str();

        json_file.close();
    }
};

template<typename TIME, template<typename T> class MODEL>
void export_model_to_json(const char* json_file_path) {
    using json_exporter=typename std::conditional<cadmium::concept::is_atomic<MODEL>::value(), Atomic_cadmiun_to_json<TIME, MODEL>, Cadmium_to_JSON<TIME, MODEL>>::type;

    json_exporter exporter;
    exporter.print_to_json(json_file_path);
};

template<typename TIME, template<typename T> class MODEL>
void export_model_to_json(const char* json_file_path, int depth) {
    using json_exporter=typename std::conditional<cadmium::concept::is_atomic<MODEL>::value(), Atomic_cadmiun_to_json<TIME, MODEL>, Cadmium_to_JSON<TIME, MODEL>>::type;

    json_exporter exporter;
    exporter.print_to_json(json_file_path, depth);
};


#endif //PMGBP_PDEVS_MODEL_JSON_EXPORTER
