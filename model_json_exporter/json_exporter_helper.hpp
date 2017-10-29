#ifndef PMGBP_PDEVS_TUPLE_PRINTER_HPP_HPP
#define PMGBP_PDEVS_TUPLE_PRINTER_HPP_HPP

#include <string>
#include <vector>
#include <boost/type_index.hpp>
#include <boost/property_tree/ptree.hpp>
#include <cadmium/modeling/message_bag.hpp>

using boost::property_tree::ptree;

/*******************************************************/
/**************** IC export to json ********************/
/*******************************************************/

template<typename TIME, typename ICs, std::size_t S>
struct add_in_tree_IC_impl {
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

        add_in_tree_IC_impl<TIME, ICs, S - 1>::print(json_IC_list);
    }
};

template<typename TIME, typename ICs>
struct add_in_tree_IC_impl<TIME, ICs, 0> {
    static void print(ptree& json_model) { /* do nothing, this is the base case */ }
};

template<typename TIME, typename ICs>
void add_in_tree_IC(ptree& json_model) {

    ptree json_IC_list;
    add_in_tree_IC_impl<TIME, ICs, std::tuple_size<ICs>::value>::print(json_IC_list);

    json_model.add_child("ic", json_IC_list);
};

#endif //PMGBP_PDEVS_TUPLE_PRINTER_HPP_HPP
