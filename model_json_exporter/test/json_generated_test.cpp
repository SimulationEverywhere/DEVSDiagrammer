/**
 * Copyright (c) 2017, Damian Vicino
 * Carleton University, Universite de Nice-Sophia Antipolis
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * 1. Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

#define BOOST_TEST_DYN_LINK
#include <boost/test/unit_test.hpp>
#include <cstdio>
#include <cadmium/logger/tuple_to_ostream.hpp>
#include <cadmium/basic_model/int_generator_one_sec.hpp>
#include <cadmium/basic_model/reset_generator_five_sec.hpp>
#include <cadmium/basic_model/generator.hpp>
#include <cadmium/basic_model/accumulator.hpp>
#include <cadmium/modeling/coupled_model.hpp>
#include <cadmium/engine/pdevs_runner.hpp>
#include "../include/model_json_exporter.hpp"

std::string read_ifstream(ifstream& file) {
    std::string txt = "";
    std::string new_line;
    if (file.is_open()) {
        while (file.good()) {
            getline(file, new_line);
            txt += "\n" + new_line;
        }
        file.close();
    }
    return txt;
}

/**
 * Checking that a known model generates the expected json output
 */

BOOST_AUTO_TEST_SUITE( json_translation_test_suite )

//generator in a coupled model definition pieces
//message representing ticks
struct test_tick{

};

//generator for tick messages
using out_port = cadmium::basic_models::generator_defs<test_tick>::out;
template <typename TIME>
using test_tick_generator_base=cadmium::basic_models::generator<test_tick, TIME>;

template<typename TIME>
struct test_generator : public test_tick_generator_base<TIME> {
    float period() const override {
        return 1.0f; //using float for time in this test, ticking every second
    }
    test_tick output_message() const override {
        return test_tick();
    }
};

//generator of ticks coupled model definition
using iports = std::tuple<>;
struct coupled_out_port : public cadmium::out_port<test_tick>{};
using oports = std::tuple<coupled_out_port>;
using submodels=cadmium::modeling::models_tuple<test_generator>;
using eics=std::tuple<>;
using eocs=std::tuple<
        cadmium::modeling::EOC<test_generator, out_port, coupled_out_port>
>;
using ics=std::tuple<>;

template<typename TIME>
using coupled_generator=cadmium::modeling::coupled_model<TIME, iports, oports, submodels, eics, eocs, ics>;

BOOST_AUTO_TEST_CASE( a_simple_model_test ){
    std::ostringstream test_output;
    export_model_to_json<float, coupled_generator>(test_output);

        std::string obtained_json = test_output.str();
        obtained_json.erase(std::remove(obtained_json.begin(), obtained_json.end(), '\n'), obtained_json.end());
        obtained_json.erase(std::remove(obtained_json.begin(), obtained_json.end(), ' '), obtained_json.end());
        std::ifstream coupled_generator_expected("../test/test_files/coupled_generator.expected.json");
        std::string expected_json = read_ifstream(coupled_generator_expected);
        expected_json.erase(std::remove(expected_json.begin(), expected_json.end(), '\n'), expected_json.end());
        expected_json.erase(std::remove(expected_json.begin(), expected_json.end(), ' '), expected_json.end());
        BOOST_CHECK_EQUAL(expected_json, obtained_json);
}


BOOST_AUTO_TEST_SUITE_END()

