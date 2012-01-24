(function($) {
    function Storage(storage) {
        this.storage = storage || localStorage;
        this.key = new Date().toDateString();
        if (this.storage.getItem(this.key) === null) {
            this.storage.setItem(this.key, JSON.stringify({}));
        }
    }

    Storage.prototype = {
        set: function(key, value) {
            var items = JSON.parse(this.storage.getItem(this.key));
            items[key] = value;
            this.storage.setItem(this.key, JSON.stringify(items));
            return true;//TODO: VALIDATION FOR OVERRRIDE
        },
        get: function(key) {
            var items = JSON.parse(this.storage.getItem(this.key));
            return items[key];
        },
        getAll: function() {
            return JSON.parse(this.storage.getItem(this.key));
        },
        load: function(key) {
            this.key = key;
            list.refresh();
        }
    };
    
    function TaskForm() {
        this.element = $('#new-task');
        this.bindEvents();
    }
    
    function FluxCapacitor() {
        this.element = $('#flux-capacitor');
        this.load();
    }
    
    FluxCapacitor.prototype = {
        load: function() {
            var html = '';
            $.each(storage.storage, function(i) {
                html += '<option value="' + storage.storage[i] + '">' + storage.storage[i] + '</option>';
            });
            this.element.html(html);
            this.bindEvents();
        },
        bindEvents: function() {
            var self = this;
            this.element.bind('change', function() {
                storage.load(self.element.val());
            });
        }
    };
    
    TaskForm.prototype = {
        bindEvents: function() {
            var self = this;
            this.element.bind('submit', function(ev) {
                ev.preventDefault();
                self.save();
                return false;
            });
        },
        save: function() {
            var title = this.element.find('#title').val();
            var description = this.element.find('#description').val();
            if (title.trim() !== '' && description.trim() !== '') {
                if (storage.set(title, description)) {
                    this.element.get(0).reset();
                    list.refresh();
                }
            }
        }
    };
    
    function TaskList() {
        this.element = $('#task-list');
        this.load();
    }
    
    TaskList.prototype = {
        load: function() {
            this.refresh();
        },
        refresh: function() {
            var items = storage.getAll();
            var html = '';
            $.each(items, function(i) {
                html += '<li><p class="title">' + i + '</p><p class="description">' + items[i] + '</p></li>'
            });
            this.element.html(html);
        }
    };
    var storage = new Storage();
    var list = new TaskList();
    var form = new TaskForm();
    var fluxCapacitor = new FluxCapacitor();
})(jQuery);