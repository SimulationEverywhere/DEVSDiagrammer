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

template<template<typename T> class MODEL, typename TIME>
class Cadmium_to_JSON {

    template<typename P>
    using submodels_type=typename MODEL<TIME>::template models<P>;
    using in_bags_type=typename make_message_bags<typename MODEL<TIME>::input_ports>::type;
    using out_bags_type=typename make_message_bags<typename MODEL<TIME>::output_ports>::type;
    using eic=typename MODEL<TIME>::external_input_couplings;
    using eoc=typename MODEL<TIME>::external_output_couplings;
    using ic=typename MODEL<TIME>::internal_couplings;

private:


public:
    Cadmium_to_JSON(const char* json_file) {

    }

    void export_to_json() {

        ptree json_model;
        add_in_tree_IC<TIME, ic>(json_model);
        std::ostringstream buf;
        write_json (buf, json_model, false);
        std::cout << buf.str();

    }
};

#endif //PMGBP_PDEVS_MODEL_JSON_EXPORTER
