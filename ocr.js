"use strict";

if (typeof(OCR) === "undefined") {
	OCR = {};
}

OCR.NodeBase = function() {};
$.extend(OCR.NodeBase, {});

OCR.Node = function() {
	OCR.NodeBase.apply(this, arguments);
	this.inputs = [];
};
OCR.Node.prototype = new OCR.NodeBase();
$.extend(OCR.Node.prototype, {
	addInput: function(edge) {
		this.inputs.push(edge);
		edge.output = this;
	},
	addOutput: function(edge) {
		this.outputs.push(edge);
		edge.input = this;
	},
	getValue: function() {
		var weightedSum = 0;
		$.each(this.inputs, function(i, edge) {
			weightedSum += edge.input.getValue() * edge.weight;
		});
		return Math.tanh(weightedSum);
	}
});

OCR.Edge = function(weight) {
	this.weight = weight || this.defaultWeight();
};
$.extend(OCR.Edge.prototype, {
	defaultWeight: function() {
		return; // TODO
	}
});

OCR.LayerBase = function(numNodes) {
	this.nodes = [];
	while (numNodes-- > 0) {
		this.nodes.push(new OCR.Node());
	}
}
$.extend(OCR.LayerBase.prototype, {
	connectOutputsToLayer: function(toLayer) {
		$.each(this.nodes, function(i, fromNode) {
			$.each(toLayer.nodes, function(i, toNode) {
				var edge = new OCR.Edge();
				fromNode.addOutput(edge);
				toNode.addInput(edge);
			});
		});
	}
});

OCR.Layer = function(numNodes) {
	OCR.LayerBase.apply(this, arguments);
};
OCR.Layer.prototype = new OCR.LayerBase();
$.extend(OCR.Layer.prototype, {
});

OCR.InputLayer = function(width, height) {
	this.width = width;
	this.height = height;
	OCR.LayerBase.call(this, width * height);
};
OCR.InputLayer.prototype = new OCR.LayerBase();
$.extend(OCR.InputLayer.prototype, {
	connectImageToInputs: function(image) {
		// TODO
	}
});

OCR.Network = function(image, options) {
	$.extend(this, this.defaultOptions, options);
	this.image = image;
	this.outputLayer = new OCR.Layer(this.hiddenLayerSize);
	this.hiddenLayer = new OCR.Layer(this.image.width * this.image.height);
	this.hiddenLayer.connectOutputsToLayer(this.outputLayer);
	this.inputLayer = new OCR.InputLayer(this.inputLayerSizeSqrt, this.inputLayerSizeSqrt);
	this.inputLayer.connectImageToInputs(this.image);
	this.inputLayer.connectOutputsToLayer(this.hiddenLayer);
};
$.extend(OCR.Network.prototype, {
	defaultOptions: {
		inputLayerSizeSqrt: 5,
		hiddenLayerSize: 10,
		learningRate: 0.5
	},
	learn: function() {
		var inputImage;
		var outputs;
		var errors;
		var totalError = 0;
		$.each(errors, function(i, error) {
			errors[i] = outputs[i] - correct[i];
		});
		$.each(errors, function(i, error) {
			totalError += error * error;
		});
		totalError *= 0.5;
	}
});

OCR.ActivationFunc = {
	"tanh": {
		"func": Math.tanh,
		"derivative": function(input) {
			var r = Math.tanh(input);
			return 1 - (r * r);
		}
	},
	"logistic": {
		"func": function(input) {
			return 1 / (1 + Math.pow(-input));
		},
		"derivative": function(input) {
			return; /* TODO */
		}
	},
};
OCR.ActivationFunc['default'] = OCR.ActivationFunc['tanh'];

(function($) {
	$(function() {
		var image = $('img.original');
		var net = new OCR.Network(image);
	});
})(jQuery);
