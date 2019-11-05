function any(sparseArray, predicate){
    for (var i in sparseArray) {    
        if (predicate(sparseArray[i])) return true;
    }
}
function getAllCapturedGroups(regex, string){
    var m = [];

    var r;
    do {
        r = regex.exec(string);
        if (r) {
            m.push(r[0]);
        }
    } while (r);
    return m;
}
function createGuid() {
    // http://note19.com/2007/05/27/javascript-guid-generator/  
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    return 'a' + s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}  
function calculateRelativeValues() {
    var variables = [];
    var guidToVariable = [];
    var errors = [];
    var errorView = document.getElementById('error-view');
    $('.inputs').each((index, el) => {
        
        var variableName = parseVariableName(el);
        var equation = parseRawEquation(el);
        if (variableName && variables[variableName]) {
            errors.push('error, you already gave something the name ' + name);
        }else{
        
            if(!el.id){
                el.id = createGuid();
            }
            if(variableName){
                guidToVariable[el.id] = variableName;

                variables[variableName] = { 'el': el, 'name':variableName, 'eq': equation, 'passedCalculation':false };
            }
        }
    });
    //do passes of calculation until everything with an equation is calculated
    var i = 0;
    while (any(variables, x=>{return !x.passedCalculation;}))
    {
        i++;
        if (i > 1000) {
            console.info("calculation loop exceeded 1000 passes. are you sure you're using this right?");
        }
        if (i > 5000) {
            console.info("calculation loop exceeded 5000 passes. assuming infinite loop and ending calculation");
            errors.push("calculation loop exceeded 5000 passes. assuming infinite loop and ending calculation");
            break;
        }
        for(var item in variables){
            try {
                if (!variables[item].passedCalculation) {
                    //find all referenced variables in eq. 
                    //regex built in
                    var re = /\$([a-zA-Z]+)/g;
                    var dependencies = getAllCapturedGroups(re, variables[item].eq);


                    var processingEq = variables[item].eq;
                    
                    variables[item].el.setUnfocusText(processingEq);
                    //check if all dependencies are already calculated
                    if(any(dependencies, dep => !variables[dep])){
                        var broken = dependencies.filter(dep => !variables[dep]);
                        errors.push('cannot find dependency : '+broken[0]+' in '+item);
                        variables[item].el.setUnfocusText(processingEq);
                        variables[item].passedCalculation = true;
                    }else{
                        if (dependencies && !any(dependencies, dep => !variables[dep].passedCalculation)) {

                            //ensure that $a never replaces $ab
                            dependencies.sort(function (a, b) {
                                // ASC  -> a.length - b.length
                                // DESC -> b.length - a.length
                                return b.length - a.length;
                            });

                            dependencies.forEach(dep => {
                                //all dependencies taken care of
                                //replace each variable reference with its related value
                                //foreach dep name

                                processingEq=processingEq.replace(dep, variables[dep].el.getUnfocusText());

                            });
                            dependencies = null;
                            
                        }
                    }
                    if(!dependencies){
                            //finally. calculate the value now that everything should be numbers and operations
                            console.info(processingEq);

                            //if we ever run into issues with replacing values in the equation, just remember that algebrajs can handle variables being sent in
                            processingEq = math.evaluate(processingEq);
                            console.info(processingEq);
                            variables[item].el.setUnfocusText(processingEq);
                            variables[item].passedCalculation = true;
                    }
                }
            }catch(error){
                console.error(error);
                errors.push(error);
                variables[item].passedCalculation = true;
            }
        }
    }
    //set the named items list to global variable so that when you click on a box, its content can be displayed.
    this.calculatedVariables = variables;
    this.calculatedInputs = guidToVariable;
    //and so clicking an error can highlight the noted boxes??
    if (errorView) {
        errorView.SetErrors(errors);
    }
}
function parseVariableName(element) {
    if(element instanceof HTMLElement)
    {
        var string = element.getFocusText();
        if (string.indexOf(":") >= 0) {
            var arr =string.split(':');
            return arr[0];
        }
    }
}
function parseRawEquation(element) {
    if(element instanceof HTMLElement)
    {
        var string = element.getFocusText();
        if (string.indexOf(":") >= 0) {
            var arr =string.split(':');
            return arr[1];
        }
    }
}


function getUnderlyingValue(element) {
    if(element instanceof HTMLElement)
    {
        element.getFocusText();
    }
}
function getCalculatedValue(element) {
    if(element instanceof HTMLElement)
    {    
        element.getUnfocusText();
    }
}
function getCalculationTex(element) {
    if(element instanceof HTMLElement)
    {

        var string = this.calculatedInputs[element.id];
        if (variables[string].eq) {
            return algebra.toTex(new algebra.parse(this.variables[string].eq));
        }
    }
    //where myEquation is the id of a div
    //katex.render(algebra.toTex(quad), myEquation);
}
