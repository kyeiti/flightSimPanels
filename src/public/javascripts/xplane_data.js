class XplaneData {
    constructor(config) {
        this.data = {};
        for (var key in config) {
            if (!config.hasOwnProperty(key)) continue;
            this.data[key] = ({
                dataRef: config[key],
                value: 0,
            });
        }
        this.data.errors = [];
    }

    update(data) {
        for (var key in this.data) {
            if (!this.data.hasOwnProperty(key)) continue;
            if(this.data[key].dataRef === data.dataRef) {
                this.data[key].value = data.value;
            }
        }
    }

    get(name) {
        return this.data[name].value;
    }

    set(name, value) {
        this.data[name].value = value;
    }

    // Todo Organize
    parsing_stuff() {
        parsed_data.fob = 0;
        for(var i = 0; i < c_tanks; i++){
            parsed_data.fob += parseElement(data, config["tank0"] + i, "float");
        }
        parsed_data["planes"] = planes;
        if(parsed_data.planes[0] == null){
            parsed_data["planes"][0] = new Plane(new Vector(0,0,0));
        }
        parsed_data["planes"][0].updatePosition(
            new Vector(
                parseElement(data, config["latitude_own"], "float"),
                parseElement(data, config["longitude_own"], "float"),
                parseElement(data, config["elevation_own"], "float")
            )
        );
        parsed_data["planes"][0].setHeading(parsed_data.compass);
        parsed_data["planes"][0].setSpeed(new Vector(parseElement(data, config["ground_speed"], "float"), 0).rotate(parsed_data.compass));
        //
        // Add Setters for new Planes up here and down there
        // Ex: parsed_data["planes"][0].setSomeFancyAttribute(parseElement(data, config["fancy_stuff"], "float"));
        // Reference the parseElement-Function for other possible variable-types
        // (Remember to put new DataRefs into the config.js as well!)
        //
        for(var i = 0; i < c_planes; i++){
            if(parsed_data.planes[i+1] == null)
                parsed_data["planes"][i+1] = new Plane(new Vector(0,0,0));
            conf_offset = i * c_plane_values;
            try{
                parsed_data["planes"][i+1].updatePosition(
                    new Vector(
                        parseElement(data, config["plane1_lat"] + conf_offset, "float"),
                        parseElement(data, config["plane1_long"] + conf_offset, "float"),
                        parseElement(data, config["plane1_el"] + conf_offset, "float")
                    )
                );
                parsed_data["planes"][i+1].setBearing(parseElement(data, config["plane1_bearing"] + conf_offset, "float"));
                parsed_data["planes"][i+1].setHeading(parseElement(data, config["plane1_hdg"] + conf_offset, "float"));
                parsed_data["planes"][i+1].setSpeed(new Vector(parseElement(data, config["plane1_gs_x"] + conf_offset, "float"), parseElement(data, config["plane1_gs_y"] + i, "float")));
                parsed_data["planes"][i+1].setTarget(parsed_data.target_index == i+1);
                //
                // Add Setters for new Planes down here and up there
                // Ex: parsed_data["planes"][i+1].setSomeFancyAttribute(parseElement(data, config["fancy_stuff"], "float"));
                //
            }
            catch(er) {
                parsed_data.errors.push("Some data for plane"+(i+1));
            }
        }
        parsed_data["stations"] = [];
        for(var i = 0; i < c_stations; i++){
            try{
                parsed_data["stations"][i] = {
                    type: parseElement(data, config["station1_type"] + i, "int"),
                    status: parseElement(data, config["station1_status"] + i, "int")
                }
            }
            catch(er) {
                parsed_data.errors.push("Some data for station" + (i+1));
            }
        }
        return parsed_data;
    }
}