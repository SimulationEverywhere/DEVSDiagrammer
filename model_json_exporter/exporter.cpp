#include <iostream>
#include <boost/type_index.hpp>
#include <boost/property_tree/ptree.hpp>
#include <boost/property_tree/json_parser.hpp>

//std::cout << boost::typeindex::type_id<decltype(A)>().pretty_name() << std::endl;

using boost::property_tree::ptree;
using boost::property_tree::write_json;

template<class MODEL>
class Cadmium_to_JSON {

    template<typename P>
    using submodels_type=typename MODEL<TIME>::template models<P>;
    using in_bags_type=typename make_message_bags<typename MODEL<TIME>::input_ports>::type;
    using out_bags_type=typename make_message_bags<typename MODEL<TIME>::output_ports>::type;
    using subcoordinators_type=typename coordinate_tuple<TIME, submodels_type, LOGGER>::type;
    using eic=typename MODEL<TIME>::external_input_couplings;
    using eoc=typename MODEL<TIME>::external_output_couplings;
    using ic=typename MODEL<TIME>::internal_couplings;

public:
    Cadmium_to_JSON(const char* json_file) {

    }

    void export_to_json() {
        


        //ptree pt;
        //pt.put ("foo", "bar");
        //std::ostringstream buf; 
        //write_json (buf, pt, false);
        //std::cout << buf.str();
    }
};
