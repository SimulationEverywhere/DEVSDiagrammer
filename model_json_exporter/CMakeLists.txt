cmake_minimum_required(VERSION 3.6.1)
project(DEVSDiagrammer)
# The version number.
set (DEVSDiagrammer_VERSION_MAJOR 0)
set (DEVSDiagrammer_VERSION_MINOR 0)

find_package(Boost COMPONENTS unit_test_framework REQUIRED)

include_directories(include ${Boost_INCLUDE_DIRS} cadmium/include )

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -pedantic -std=c++1z")

enable_testing()
FILE(GLOB TestSources RELATIVE ${CMAKE_CURRENT_SOURCE_DIR} test/*_test.cpp)
foreach(testSrc ${TestSources})
        get_filename_component(testName ${testSrc} NAME_WE)
        add_executable(${testName} test/main-test.cpp ${testSrc})
        target_link_libraries(${testName} ${Boost_UNIT_TEST_FRAMEWORK_LIBRARY})
	add_test(${testName} ${testName})
endforeach(testSrc)

