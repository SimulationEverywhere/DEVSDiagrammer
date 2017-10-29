#ifndef PMGBP_PDEVS_TUPLE_PRINTER_HPP_HPP
#define PMGBP_PDEVS_TUPLE_PRINTER_HPP_HPP

#include <string>
#include <vector>
#include <boost/type_index.hpp>
#include <boost/property_tree/ptree.hpp>
#include <cadmium/modeling/message_bag.hpp>
#include <cadmium/modeling/ports.hpp>

using boost::property_tree::ptree;
using cadmium::make_message_bags;

/*******************************************************/
/**************** IC export to json ********************/
/*******************************************************/

template<typename TIME, typename ICs, std::size_t S>
struct IC_to_json_impl {
    using current_IC=typename std::tuple_element<S - 1, ICs>::type;
    using from_model=typename current_IC::template from_model<TIME>;
    using from_port=typename current_IC::from_model_output_port;
    using to_model=typename current_IC::template to_model<TIME>;
    using to_port=typename current_IC::to_model_input_port;

    static void print(ptree& json_IC_list) {

        ptree current_json_ic;
        current_json_ic.put("from_model", boost::typeindex::type_id<from_model>().pretty_name());
        current_json_ic.put("from_port", boost::typeindex::type_id<from_port>().pretty_name());
        current_json_ic.put("to_model", boost::typeindex::type_id<to_model>().pretty_name());
        current_json_ic.put("to_port", boost::typeindex::type_id<to_port>().pretty_name());
        json_IC_list.push_back(std::make_pair("", current_json_ic));

        IC_to_json_impl<TIME, ICs, S - 1>::print(json_IC_list);
    }
};

template<typename TIME, typename ICs>
struct IC_to_json_impl<TIME, ICs, 0> {
    static void print(ptree& json_IC_list) { /* do nothing, this is the base case */ }
};

template<typename TIME, typename ICs>
void IC_to_json(ptree &json_model) {

    ptree json_IC_list;
    IC_to_json_impl<TIME, ICs, std::tuple_size<ICs>::value>::print(json_IC_list);

    json_model.add_child("ic", json_IC_list);
};

/*******************************************************/
/**************** EIC export to json ********************/
/*******************************************************/

template<typename TIME, typename EICs, std::size_t S>
struct EIC_to_json_impl {
    using current_EIC=typename std::tuple_element<S-1, EICs>::type;
    using from_port=typename current_EIC::external_input_port;
    using to_model=typename current_EIC::template submodel<TIME>;
    using to_port=typename current_EIC::submodel_input_port;

    static void print(ptree& json_EIC_list) {

        ptree current_json_eic;
        current_json_eic.put("from_port", boost::typeindex::type_id<from_port>().pretty_name());
        current_json_eic.put("to_model", boost::typeindex::type_id<to_model>().pretty_name());
        current_json_eic.put("to_port", boost::typeindex::type_id<to_port>().pretty_name());
        json_EIC_list.push_back(std::make_pair("", current_json_eic));

        EIC_to_json_impl<TIME, EICs, S - 1>::print(json_EIC_list);
    }
};

template<typename TIME, typename EICs>
struct EIC_to_json_impl<TIME, EICs, 0> {
    static void print(ptree& json_EIC_list) { /* do nothing, this is the base case */ }
};

template<typename TIME, typename EICs>
void EIC_to_json(ptree &json_model) {

    ptree json_EIC_list;
    EIC_to_json_impl<TIME, EICs, std::tuple_size<EICs>::value>::print(json_EIC_list);

    json_model.add_child("eic", json_EIC_list);
};

/*******************************************************/
/**************** EOC export to json ********************/
/*******************************************************/

template<typename TIME, typename EOCs, std::size_t S>
struct EOC_to_json_impl {
    using current_EOC=typename std::tuple_element<S-1, EOCs>::type;
    using to_port=typename current_EOC::external_output_port;
    using from_model = typename current_EOC::template submodel<TIME>;
    using from_port=typename current_EOC::submodel_output_port;

    static void print(ptree& json_EOC_list) {

        ptree current_json_eoc;
        current_json_eoc.put("to_port", boost::typeindex::type_id<to_port>().pretty_name());
        current_json_eoc.put("from_model", boost::typeindex::type_id<from_model>().pretty_name());
        current_json_eoc.put("from_port", boost::typeindex::type_id<from_port>().pretty_name());

        json_EOC_list.push_back(std::make_pair("", current_json_eoc));

        EOC_to_json_impl<TIME, EOCs, S - 1>::print(json_EOC_list);
    }
};

template<typename TIME, typename EOCs>
struct EOC_to_json_impl<TIME, EOCs, 0> {
    static void print(ptree& json_EOC_list) { /* do nothing, this is the base case */ }
};

template<typename TIME, typename EOCs>
void EOC_to_json(ptree &json_model) {

    ptree json_EOC_list;
    EOC_to_json_impl<TIME, EOCs, std::tuple_size<EOCs>::value>::print(json_EOC_list);

    json_model.add_child("eoc", json_EOC_list);
};

/*******************************************************/
/*************** ports export to json ******************/
/*******************************************************/

template<typename TIME, typename PORTS, std::size_t S>
struct ports_to_json_impl {
    using current_port=typename std::tuple_element<S-1, PORTS>::type;
    using message_type=typename current_port::message_type;

    static void print(ptree& json_ports_list) {

        ptree current_json_port;
        current_json_port.put("name", boost::typeindex::type_id<current_port>().pretty_name());
        current_json_port.put("message_type", boost::typeindex::type_id<message_type>().pretty_name());

        if (current_port::kind == cadmium::port_kind::out) {
            current_json_port.put("port_kind", "out");
        } else {
            current_json_port.put("port_kind", "in");
        }

        json_ports_list.push_back(std::make_pair("", current_json_port));

        ports_to_json_impl<TIME, PORTS, S - 1>::print(json_ports_list);
    }
};

template<typename TIME, typename PORTS>
struct ports_to_json_impl<TIME, PORTS, 0> {
    static void print(ptree& json_ports_list) { /* do nothing, this is the base case */ }
};

template<typename TIME, typename PORTS>
void ports_to_json(ptree &json_model, cadmium::port_kind outin) {

    ptree json_ports_list;
    ports_to_json_impl<TIME, PORTS, std::tuple_size<PORTS>::value>::print(json_ports_list);

    if (outin == cadmium::port_kind::out) {
        json_model.add_child("out", json_ports_list);
    } else {
        json_model.add_child("in", json_ports_list);
    }
};

/*******************************************************/
/************* submodels export to json ****************/
/*******************************************************/

template<typename TIME,  template<typename> class SUBMODELS, template<template<typename MT> typename M> typename COUPLED_JSON_EXPORTER, template<template<typename MT> typename M> typename ATOMIC_JSON_EXPORTER, std::size_t S>
struct submodels_to_json_impl {

    template <typename T>
    using current_submodel=typename std::tuple_element<S - 1, SUBMODELS<T>>::type;
    using submodel_json_exporter=typename std::conditional<cadmium::concept::is_atomic<current_submodel>::value(), ATOMIC_JSON_EXPORTER<current_submodel>, COUPLED_JSON_EXPORTER<current_submodel>>::type;

    static void print(ptree& json_submodels_list) {

        ptree current_json_submodel;
        submodel_json_exporter exporter;
        exporter.export_to_json(current_json_submodel);

        json_submodels_list.push_back(std::make_pair("", current_json_submodel));

        submodels_to_json_impl<TIME, SUBMODELS, COUPLED_JSON_EXPORTER, ATOMIC_JSON_EXPORTER, S - 1>::print(json_submodels_list);
    }
};

template<typename TIME,  template<typename> typename SUBMODELS, template<template<typename MT> typename M> typename COUPLED_JSON_EXPORTER, template<template<typename MT> typename M> typename ATOMIC_JSON_EXPORTER>
struct submodels_to_json_impl<TIME, SUBMODELS, COUPLED_JSON_EXPORTER, ATOMIC_JSON_EXPORTER, 0> {
    static void print(ptree& json_submodels_list) { /* do nothing, this is the base case */ }
};

template<typename TIME,  template<typename> typename SUBMODELS, template<template<typename MT> typename M> typename COUPLED_JSON_EXPORTER, template<template<typename MT> typename M> typename ATOMIC_JSON_EXPORTER>
void submodels_to_json(ptree &json_model) {

    ptree json_submodels_list;
    submodels_to_json_impl<TIME, SUBMODELS, COUPLED_JSON_EXPORTER, ATOMIC_JSON_EXPORTER, std::tuple_size<SUBMODELS<TIME>>::value>::print(json_submodels_list);
    json_model.add_child("models", json_submodels_list);
};

#endif //PMGBP_PDEVS_TUPLE_PRINTER_HPP_HPP
