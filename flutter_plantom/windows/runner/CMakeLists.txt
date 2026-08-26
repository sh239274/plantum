cmake_minimum_required(VERSION 3.14)
project(runner LANGUAGES CXX)

set(BINARY_NAME "plantom")

add_executable(${BINARY_NAME} WIN32
  "flutter_window.cpp"
  "main.cpp"
  "utils.cpp"
  "win32_window.cpp"
  "Runner.rc"
  "runner.exe.manifest"
)

apply_standard_settings(${BINARY_NAME})
set_target_properties(${BINARY_NAME} PROPERTIES
  OUTPUT_NAME "Plantom"
)

target_compile_definitions(${BINARY_NAME} PRIVATE "_HAS_EXCEPTIONS=0")
target_compile_definitions(${BINARY_NAME} PRIVATE UNICODE _UNICODE)

target_include_directories(${BINARY_NAME} PRIVATE
  "${CMAKE_SOURCE_DIR}"
)

target_link_libraries(${BINARY_NAME} PRIVATE flutter flutter_wrapper_app)
target_link_libraries(${BINARY_NAME} PRIVATE dwmapi)

add_dependencies(${BINARY_NAME} flutter_assemble)
